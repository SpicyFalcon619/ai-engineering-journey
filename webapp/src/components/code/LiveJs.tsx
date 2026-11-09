import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Play, Square, Undo2, X } from 'lucide-react'
import { jsRunner, JsRunStopped, useJsStatus, type JsStream } from '@/lib/jsRunner'
import JsEditor from '@/components/code/JsEditor'
import { cn } from '@/lib/cn'

interface Chunk {
  stream: JsStream
  text: string
}

interface LiveJsProps {
  initialCode: string
  /** The number shown beside the first line, so a lesson's blocks keep their real line numbers. */
  firstLine?: number
  variant?: 'block' | 'page'
  label?: string
  onCodeChange?: (code: string) => void
  /** Run as soon as the editor appears (the reader pressed Run on a lesson's block). */
  autoRun?: boolean
  /** Lets a lesson's block go back to its plain code and sample output. */
  onClose?: () => void
}

// A page of output is plenty; a runaway loop printing forever must not freeze the tab.
const OUTPUT_LIMIT = 100_000

const button =
  'flex min-h-6 cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-50'
const quiet =
  'border-[var(--color-code-border)] bg-[var(--color-code-surface)] text-[var(--color-code-ink-dim)] hover:border-[var(--color-code-border-strong)] hover:bg-[var(--color-code-surface-hover)] hover:text-[var(--color-code-ink)]'

export default function LiveJs({
  initialCode,
  firstLine = 1,
  variant = 'block',
  label = 'Editable JavaScript code',
  onCodeChange,
  autoRun = false,
  onClose,
}: LiveJsProps) {
  const owner = useId()
  const status = useJsStatus()
  const [code, setCode] = useState(initialCode)
  const [chunks, setChunks] = useState<Chunk[]>([])
  const [running, setRunning] = useState(false)
  const [outcome, setOutcome] = useState<{ ok: boolean; ms: number } | null>(null)
  const [note, setNote] = useState('')

  // Output arrives in many small pieces; paint it once per frame.
  const buffer = useRef<Chunk[]>([])
  const total = useRef(0)
  const frame = useRef(0)
  const flush = useCallback(() => {
    frame.current = 0
    const pending = buffer.current
    buffer.current = []
    if (!pending.length) return
    setChunks((current) => {
      const next = current.slice()
      for (const piece of pending) {
        const last = next[next.length - 1]
        if (last && last.stream === piece.stream) next[next.length - 1] = { stream: last.stream, text: last.text + piece.text }
        else next.push(piece)
      }
      return next
    })
  }, [])
  const append = useCallback(
    (stream: JsStream, text: string) => {
      if (total.current >= OUTPUT_LIMIT) return
      total.current += text.length
      if (total.current >= OUTPUT_LIMIT) {
        text = text.slice(0, Math.max(0, text.length - (total.current - OUTPUT_LIMIT))) + '\n... output cut off here ...\n'
      }
      buffer.current.push({ stream, text })
      if (!frame.current) frame.current = requestAnimationFrame(flush)
    },
    [flush],
  )
  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const edit = (next: string) => {
    setCode(next)
    onCodeChange?.(next)
  }

  const run = useCallback(async () => {
    if (running) return
    setRunning(true)
    setChunks([])
    setOutcome(null)
    setNote('')
    buffer.current = []
    total.current = 0
    try {
      const result = await jsRunner.run({ code, owner, onOutput: (stream, text) => append(stream, text) })
      flush()
      setOutcome(result)
    } catch (error) {
      flush()
      if (error instanceof JsRunStopped) setNote('Stopped.')
      else append('err', `${error instanceof Error ? error.message : String(error)}\n`)
    } finally {
      flush()
      setRunning(false)
    }
  }, [running, code, owner, append, flush])

  // A block opened with Run starts straight away. The guard stops React's double effect from running it twice.
  const started = useRef(false)
  useEffect(() => {
    if (autoRun && !started.current) {
      started.current = true
      void run()
    }
  }, [autoRun, run])

  // Leaving while a program runs ends it, so a frame is never left running in the background.
  useEffect(
    () => () => {
      if (jsRunner.getStatus().owner === owner) jsRunner.stop()
    },
    [owner],
  )

  const busyElsewhere = !running && status.owner !== null && status.owner !== owner && status.phase === 'running'
  const changed = code !== initialCode
  const showOutput = chunks.length > 0 || note || outcome

  return (
    <div className={cn('live', variant === 'page' && 'live-page')}>
      <JsEditor value={code} onChange={edit} onRun={() => void run()} firstLine={firstLine} label={label} />

      <div className="guide-part-bar">
        <div className="flex flex-wrap items-center gap-2">
          {running ? (
            <button type="button" onClick={() => jsRunner.stop()} className={cn(button, 'border-[var(--color-code-ember)] text-[var(--color-code-ember-soft)] hover:bg-[var(--color-code-surface-hover)]')}>
              <Square className="h-3 w-3 fill-current" aria-hidden /> Stop
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void run()}
              className={cn(button, 'border-[var(--color-code-accent-glow)] bg-[var(--color-code-accent-glow)]/20 text-[var(--color-code-accent-soft)] hover:bg-[var(--color-code-accent-glow)]/35')}
            >
              <Play className="h-3 w-3" aria-hidden /> Run
            </button>
          )}
          <span className="hidden text-xs text-[var(--color-code-ink-faint)] sm:inline">Ctrl+Enter</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {changed && (
            <button type="button" onClick={() => edit(initialCode)} className={cn(button, quiet)}>
              <Undo2 className="h-3 w-3" aria-hidden /> Revert
            </button>
          )}
          {onClose && (
            <button type="button" onClick={onClose} className={cn(button, quiet)} title="Back to the lesson's code and sample output">
              <X className="h-3 w-3" aria-hidden /> Close
            </button>
          )}
        </div>
      </div>

      <div className="live-status" role="status" aria-live="polite">
        {busyElsewhere ? 'Another block is running. Pressing Run here will end it and start this one.' : ''}
      </div>

      {showOutput && (
        <div className="guide-part-out" role="region" aria-label="Output">
          {chunks.length > 0 && (
            <pre tabIndex={0}>
              {chunks.map((chunk, index) => (
                <span key={index} className={chunk.stream === 'err' ? 'live-err' : undefined}>
                  {chunk.text}
                </span>
              ))}
            </pre>
          )}
          {note && <p className="guide-part-none">{note}</p>}
          {outcome && chunks.length === 0 && !note && <p className="guide-part-none">The program ran and printed nothing.</p>}
          {outcome && <p className="live-meta">{outcome.ok ? `Finished in ${(outcome.ms / 1000).toFixed(2)} s` : 'Stopped with an error'}</p>}
        </div>
      )}
    </div>
  )
}
