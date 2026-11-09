// The page's handle on the live JavaScript runner. Code runs in the reader's own browser, inside a hidden,
// sandboxed frame: `sandbox="allow-scripts"` without `allow-same-origin`, so the code cannot read this site's
// storage or cookies. A fresh frame is made for every run and thrown away afterwards.
//
// The frame replaces console.* (so output comes back here as it is printed), watches timers and fetch calls (so
// the run knows when the program has really finished, even after setTimeout or await), and turns uncaught
// errors into output. There is no keyboard input: lessons print, they do not prompt.
import { useSyncExternalStore } from 'react'

export type JsPhase = 'idle' | 'running'
export interface JsStatus {
  phase: JsPhase
  message: string
  /** Which editor owns the run in progress, so only that editor shows a Stop state. */
  owner: string | null
}

/** 'out' is what the program printed, 'err' its error stream (console.error and uncaught errors). */
export type JsStream = 'out' | 'err'

export interface JsRunOptions {
  code: string
  owner: string
  onOutput: (stream: JsStream, text: string) => void
}

export interface JsRunResult {
  ok: boolean
  ms: number
}

/** Thrown to a run when the reader presses Stop. */
export class JsRunStopped extends Error {
  constructor() {
    super('Stopped')
    this.name = 'JsRunStopped'
  }
}

/** A run that has not finished by now is stopped: a runaway loop must not hold the tab. */
const RUN_LIMIT_MS = 20_000
const START_FAILED = 'The code runner could not start in this browser.'

// The page inside the frame. It is plain JavaScript text because the frame is built from a string (srcdoc).
// Messages in:  { type: 'run', code }
// Messages out: { type: 'ready' }  { type: 'out', stream: 0 | 1, text }  { type: 'done', ok }
const RUNNER_PAGE = `<!doctype html><html><head><meta charset="utf-8"></head><body><script>
(function () {
  var send = function (m) { parent.postMessage(m, '*') }
  var pending = 0
  var lastActivity = Date.now()
  var touch = function () { lastActivity = Date.now() }
  var failed = false

  // ---- Printing, in the style Node prints (so a live run reads like the captured output) -----------------
  var quote = function (s) {
    var q = s.indexOf("'") === -1 ? "'" : s.indexOf('"') === -1 ? '"' : s.indexOf('\`') === -1 ? '\`' : "'"
    return q + s.replace(/\\\\/g, '\\\\\\\\').replace(/\\n/g, '\\\\n').replace(new RegExp(q, 'g'), '\\\\' + q) + q
  }
  var inspect = function (v, depth, seen) {
    if (v === null) return 'null'
    if (v === undefined) return 'undefined'
    var t = typeof v
    if (t === 'string') return depth === 0 ? v : quote(v)
    if (t === 'number' || t === 'boolean') return String(v)
    if (t === 'bigint') return String(v) + 'n'
    if (t === 'symbol') return v.toString()
    if (t === 'function') return v.name ? '[Function: ' + v.name + ']' : '[Function (anonymous)]'
    if (v instanceof Error) return depth === 0 ? v.name + ': ' + v.message : '[' + v.name + ': ' + v.message + ']'
    if (v instanceof Promise) return 'Promise { <pending> }'
    if (seen.indexOf(v) !== -1) return '[Circular]'
    if (depth > 2) return Array.isArray(v) ? '[Array]' : '[Object]'
    seen = seen.concat([v])
    var parts
    var open = '{', close = '}'
    if (Array.isArray(v)) {
      open = '['; close = ']'
      parts = v.slice(0, 100).map(function (x) { return inspect(x, depth + 1, seen) })
      if (v.length > 100) parts.push('... ' + (v.length - 100) + ' more items')
    } else if (v instanceof Map) {
      open = 'Map(' + v.size + ') {'
      parts = Array.from(v).map(function (e) { return inspect(e[0], depth + 1, seen) + ' => ' + inspect(e[1], depth + 1, seen) })
    } else if (v instanceof Set) {
      open = 'Set(' + v.size + ') {'
      parts = Array.from(v).map(function (x) { return inspect(x, depth + 1, seen) })
    } else {
      var keys = Object.keys(v)
      parts = keys.map(function (k) {
        var key = /^[A-Za-z_$][\\w$]*$/.test(k) ? k : quote(k)
        return key + ': ' + inspect(v[k], depth + 1, seen)
      })
      var name = v.constructor && v.constructor.name
      if (name && name !== 'Object') open = name + ' {'
    }
    if (!parts.length) return open + close
    var oneLine = open + ' ' + parts.join(', ') + ' ' + close
    if (oneLine.length <= 72 && oneLine.indexOf('\\n') === -1) return oneLine
    var pad = new Array(depth + 2).join('  ')
    return open + '\\n' + pad + parts.join(',\\n' + pad) + '\\n' + new Array(depth + 1).join('  ') + close
  }
  var format = function (args) {
    return Array.prototype.map.call(args, function (a) { return inspect(a, 0, []) }).join(' ')
  }
  var emit = function (stream, text) { touch(); send({ type: 'out', stream: stream, text: text + '\\n' }) }
  var report = function (error, prefix) {
    failed = true
    var text = error instanceof Error ? error.name + ': ' + error.message : String(error)
    emit(1, prefix + text)
  }
  var groupIndent = ''
  ;['log', 'info', 'debug'].forEach(function (name) { console[name] = function () { emit(0, groupIndent + format(arguments)) } })
  ;['error', 'warn', 'trace'].forEach(function (name) { console[name] = function () { emit(1, groupIndent + format(arguments)) } })
  console.table = console.dir = function () { emit(0, groupIndent + format(arguments)) }
  console.group = function () { if (arguments.length) emit(0, groupIndent + format(arguments)); groupIndent += '  ' }
  console.groupEnd = function () { groupIndent = groupIndent.slice(2) }
  console.assert = function (ok) { if (!ok) emit(1, 'Assertion failed' + (arguments.length > 1 ? ': ' + format(Array.prototype.slice.call(arguments, 1)) : '')) }
  var timers = {}
  console.time = function (label) { timers[label || 'default'] = performance.now() }
  console.timeEnd = function (label) { var l = label || 'default'; emit(0, l + ': ' + (performance.now() - timers[l]).toFixed(3) + 'ms') }

  // ---- Knowing when the program has finished ----------------------------------------------------------------
  var realSetTimeout = window.setTimeout.bind(window)
  var realClearTimeout = window.clearTimeout.bind(window)
  var live = {}
  window.setTimeout = function (fn, ms) {
    var rest = Array.prototype.slice.call(arguments, 2)
    if (typeof fn !== 'function') return realSetTimeout.apply(window, arguments)
    touch()
    var id = realSetTimeout(function () {
      delete live[id]
      touch()
      try { fn.apply(null, rest) } catch (e) { report(e, 'Uncaught ') }
    }, ms)
    live[id] = true
    return id
  }
  window.clearTimeout = function (id) { delete live[id]; realClearTimeout(id) }
  var realSetInterval = window.setInterval.bind(window)
  var realClearInterval = window.clearInterval.bind(window)
  window.setInterval = function (fn, ms) {
    var rest = Array.prototype.slice.call(arguments, 2)
    touch()
    var id = realSetInterval(function () { touch(); try { fn.apply(null, rest) } catch (e) { report(e, 'Uncaught ') } }, ms)
    live[id] = true
    return id
  }
  window.clearInterval = function (id) { delete live[id]; realClearInterval(id) }
  var realFetch = window.fetch.bind(window)
  window.fetch = function () {
    pending++
    touch()
    return realFetch.apply(null, arguments).finally(function () { pending--; touch() })
  }
  window.addEventListener('error', function (e) { report(e.error || e.message, 'Uncaught '); e.preventDefault() })
  window.addEventListener('unhandledrejection', function (e) { report(e.reason, 'Uncaught (in promise) '); e.preventDefault() })

  var finished = false
  var finish = function () {
    if (finished) return
    finished = true
    send({ type: 'done', ok: !failed })
  }
  var settle = function () {
    var check = function () {
      var quiet = Object.keys(live).length === 0 && pending === 0 && Date.now() - lastActivity > 250
      if (quiet) finish()
      else realSetTimeout(check, 40)
    }
    check()
  }

  addEventListener('message', function (event) {
    if (event.source !== parent) return
    var message = event.data || {}
    if (message.type !== 'run') return
    touch()
    var url = URL.createObjectURL(new Blob([String(message.code)], { type: 'text/javascript' }))
    import(url).then(settle, function (error) { report(error, ''); settle() })
  })
  send({ type: 'ready' })
})()
</script></body></html>`

interface Active {
  options: JsRunOptions
  startedAt: number
  resolve(result: JsRunResult): void
  reject(error: Error): void
}

class JsRunner {
  private frame: HTMLIFrameElement | null = null
  private active: Active | null = null
  private timer = 0
  private status: JsStatus = { phase: 'idle', message: '', owner: null }
  private listeners = new Set<() => void>()

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => void this.listeners.delete(listener)
  }
  getStatus = () => this.status

  private setStatus(phase: JsPhase, owner: string | null) {
    this.status = { phase, message: '', owner }
    this.listeners.forEach((listener) => listener())
  }

  private teardown() {
    window.clearTimeout(this.timer)
    window.removeEventListener('message', this.handle)
    this.frame?.remove()
    this.frame = null
    this.setStatus('idle', null)
  }

  private handle = (event: MessageEvent) => {
    if (!this.frame || event.source !== this.frame.contentWindow) return
    const message = event.data as { type?: string; stream?: number; text?: string; ok?: boolean }
    const active = this.active
    if (!active) return
    if (message.type === 'out') {
      active.options.onOutput(message.stream === 1 ? 'err' : 'out', message.text ?? '')
    } else if (message.type === 'done') {
      this.active = null
      this.teardown()
      active.resolve({ ok: message.ok !== false, ms: performance.now() - active.startedAt })
    }
  }

  run(options: JsRunOptions): Promise<JsRunResult> {
    // One program at a time: a new Run ends the one before it.
    if (this.active) this.stop()
    return new Promise<JsRunResult>((resolve, reject) => {
      const frame = document.createElement('iframe')
      frame.setAttribute('sandbox', 'allow-scripts')
      frame.setAttribute('aria-hidden', 'true')
      frame.title = 'JavaScript runner (hidden)'
      frame.tabIndex = -1
      frame.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;border:0;visibility:hidden'
      frame.srcdoc = RUNNER_PAGE
      this.frame = frame
      this.active = { options, startedAt: performance.now(), resolve, reject }
      this.setStatus('running', options.owner)

      const onReady = (event: MessageEvent) => {
        if (event.source !== frame.contentWindow || (event.data as { type?: string })?.type !== 'ready') return
        window.removeEventListener('message', onReady)
        frame.contentWindow?.postMessage({ type: 'run', code: options.code }, '*')
      }
      window.addEventListener('message', onReady)
      window.addEventListener('message', this.handle)
      this.timer = window.setTimeout(() => {
        window.removeEventListener('message', onReady)
        const active = this.active
        this.active = null
        this.teardown()
        if (active) {
          active.options.onOutput('err', `\nStopped: the program was still running after ${RUN_LIMIT_MS / 1000} seconds.\n`)
          active.resolve({ ok: false, ms: performance.now() - active.startedAt })
        }
      }, RUN_LIMIT_MS)
      frame.addEventListener('error', () => {
        window.removeEventListener('message', onReady)
        this.active = null
        this.teardown()
        reject(new Error(START_FAILED))
      })
      document.body.appendChild(frame)
    })
  }

  /** The code runs in the browser itself, so there is nothing to download or warm up. Kept so call sites stay simple. */
  prepare() {}
  warmUp() {}

  /** Ends whatever is running, even a program stuck in a loop. */
  stop() {
    const active = this.active
    this.active = null
    this.teardown()
    active?.reject(new JsRunStopped())
  }
}

export const jsRunner = new JsRunner()

export function useJsStatus(): JsStatus {
  return useSyncExternalStore(jsRunner.subscribe, jsRunner.getStatus)
}
