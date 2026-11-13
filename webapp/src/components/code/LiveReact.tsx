import { useCallback, useEffect, useRef, useState } from 'react'
import { RotateCcw, Undo2, X } from 'lucide-react'
import JsEditor from '@/components/code/JsEditor'
import { cn } from '@/lib/cn'

// A React lesson you can edit, with the result drawn right under it. The code runs in a sandboxed frame (scripts only,
// no access to the site's storage) that loads public/react-runner.js: React and a JSX translator in one file. Edits show
// as you type, after a short pause. Nothing is sent anywhere.

interface LiveReactProps {
  initialCode: string
  /** The number shown beside the first line, so the code keeps its real line numbers. */
  firstLine?: number
  label?: string
  onClose?: () => void
}

const button =
  'flex min-h-6 cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-50'
const quiet =
  'border-[var(--color-code-border)] bg-[var(--color-code-surface)] text-[var(--color-code-ink-dim)] hover:border-[var(--color-code-border-strong)] hover:bg-[var(--color-code-surface-hover)] hover:text-[var(--color-code-ink)]'

// The page inside the frame: an empty root, and the runner file. It looks like a plain web page, not like the site.
function frameDocument(runnerUrl: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0}
body{padding:14px 16px;background:#fff;color:#111;font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
</style></head><body><div id="root"></div><script src="${runnerUrl}"></script></body></html>`
}

export default function LiveReact({ initialCode, firstLine = 1, label = 'Editable React code', onClose }: LiveReactProps) {
  const [code, setCode] = useState(initialCode)
  const [error, setError] = useState('')
  const [height, setHeight] = useState(80)
  const [ready, setReady] = useState(false)
  const frame = useRef<HTMLIFrameElement>(null)
  const latest = useRef(code)
  latest.current = code

  // The runner file sits next to the site's own files, whatever the site is served under.
  const [runnerUrl] = useState(() => new URL(`${import.meta.env.BASE_URL}react-runner.js`, window.location.href).href)
  const [srcDoc] = useState(() => frameDocument(runnerUrl))

  const post = useCallback((source: string) => {
    frame.current?.contentWindow?.postMessage({ type: 'run', code: source }, '*')
  }, [])

  // Messages from the frame.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow) return
      const data = event.data as { type?: string; message?: string; value?: number }
      if (data.type === 'ready') {
        setReady(true)
        post(latest.current)
      } else if (data.type === 'rendered') {
        setError('')
      } else if (data.type === 'error') {
        setError(data.message ?? 'Something went wrong.')
      } else if (data.type === 'height' && typeof data.value === 'number') {
        setHeight(Math.max(60, Math.min(data.value, 700)))
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [post])

  // Show the edits shortly after typing stops.
  useEffect(() => {
    if (!ready) return
    const timer = window.setTimeout(() => post(code), 350)
    return () => window.clearTimeout(timer)
  }, [code, ready, post])

  const changed = code !== initialCode

  return (
    <div className="live live-page">
      <JsEditor value={code} onChange={setCode} onRun={() => post(latest.current)} firstLine={firstLine} label={label} jsx />

      <div className="guide-part-bar">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => post(latest.current)} className={cn(button, quiet)} title="Draw it again from the start, like reloading the page">
            <RotateCcw className="h-3 w-3" aria-hidden /> Restart
          </button>
          <span className="hidden text-xs text-[var(--color-code-ink-faint)] sm:inline">Shows as you type</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {changed && (
            <button type="button" onClick={() => setCode(initialCode)} className={cn(button, quiet)}>
              <Undo2 className="h-3 w-3" aria-hidden /> Revert
            </button>
          )}
          {onClose && (
            <button type="button" onClick={onClose} className={cn(button, quiet)} title="Back to the lesson's code">
              <X className="h-3 w-3" aria-hidden /> Close
            </button>
          )}
        </div>
      </div>

      <p className="live-meta live-caption" style={{ padding: '0.5rem 0.9rem 0' }}>
        Result
      </p>
      <div className="react-preview">
        <iframe
          ref={frame}
          title="Result of the React code"
          sandbox="allow-scripts"
          srcDoc={srcDoc}
          style={{ height }}
          className="block w-full border-0 bg-white"
        />
      </div>
      {error && (
        <div className="guide-part-out" role="alert">
          <pre className="live-err" tabIndex={0}>
            {error}
          </pre>
        </div>
      )}
    </div>
  )
}
