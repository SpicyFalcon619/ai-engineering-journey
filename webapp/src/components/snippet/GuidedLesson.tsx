import { createContext, lazy, Suspense, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, PencilLine, Play } from 'lucide-react'
import { getTerm, TERM_PATTERN, termIdOf, termsIn } from '@/lib/glossary'
import { practiceToGuide } from '@/lib/practiceGuide'
import { PRACTICE_VIEW } from '@/lib/features'
import { NotesView } from '@/components/snippet/NotesView'
import { jsRunner } from '@/lib/jsRunner'
import { chunkTransformer, getHighlighter, langForFile, SHIKI_THEME_BY_SITE_THEME } from '@/lib/highlighter'
import type { BannerSection, LessonBlock, ProseNode } from '@/lib/lesson'
import type { BlockRun, CapturedOutput } from '@/lib/outputs'
import type { Topic } from '@/types'
import { useTheme } from '@/hooks/useTheme'
import { Dropdown } from '@/components/ui/Dropdown'
import { CopyButton } from '@/components/code/CopyButton'
import { FontSizeControl } from '@/components/code/FontSizeControl'
import { CaptureDialogButton } from '@/components/code/CaptureDialog'
import { cn } from '@/lib/cn'

// The editor and the runner load only when a reader presses Edit on a block.
const LiveJs = lazy(() => import('@/components/code/LiveJs'))

// The whole file at the bottom of a practice lesson has no stored output. It only offers Edit and run.
const FULL_FILE_RUN: BlockRun = { status: 'ok', scenarios: [{ label: '', inputs: [], stdout: '', segments: [] }] }

interface GuidedLessonProps {
  /** Shown at the left of the toolbar (the lesson's view switcher). */
  leading?: ReactNode
  blocks: LessonBlock[]
  code: string
  /** The lesson's path in the repo, which a question's written explanation is looked up by. */
  path: string
  filename: string
  topics: Topic[]
  /** What every code block of this lesson printed when Node ran it, while the site was built. */
  output?: CapturedOutput
  focusLine?: number
  /** The explanation, drawn from the study notes. It comes first, and the lesson's own code follows as "Your code". */
  notes?: ReactNode
}

// Words in prose that are really code: `backticked`, name(...) calls, __dunders__.
const INLINE_CODE = /(`[^`]+`|(?<!\w)\.?[A-Za-z_][\w.]*\((?:[^()]|\([^()]*\))*\)|__\w+__)/g

// The glossary terms that may be underlined in the block being drawn: only the first block of a lesson that
// uses a term underlines it, so the page is not full of underlines.
const TermsContext = createContext<ReadonlySet<string>>(new Set())
const NO_TERMS: ReadonlySet<string> = new Set()

// A word with a meaning behind it. Hover (mouse), tap or Enter (touch, keyboard) shows the short meaning.
function Term({ id, children }: { id: string; children: ReactNode }) {
  const entry = getTerm(id)
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLSpanElement>(null)
  const mouse = useRef(false)
  const closing = useRef(0)

  useEffect(() => () => window.clearTimeout(closing.current), [])

  useEffect(() => {
    if (!open) return
    const outside = (event: MouseEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('mousedown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [open])

  if (!entry) return <>{children}</>
  return (
    <span
      ref={wrap}
      className="guide-term-wrap"
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') {
          mouse.current = true
          window.clearTimeout(closing.current)
          setOpen(true)
        }
      }}
      onPointerLeave={(event) => {
        // A short grace period, so a slightly off path toward the card does not dismiss it.
        if (event.pointerType === 'mouse') closing.current = window.setTimeout(() => setOpen(false), 180)
      }}
    >
      <button
        type="button"
        className="guide-term"
        aria-expanded={open}
        aria-describedby={open ? `term-${id}` : undefined}
        onClick={() => setOpen((value) => (mouse.current ? true : !value))}
      >
        {children}
      </button>
      {open && (
        <span role="tooltip" id={`term-${id}`} className="guide-term-pop">
          <strong>{entry.term}</strong> {entry.short}{' '}
          <Link to={`/glossary?term=${id}`} className="guide-term-more">
            More in the glossary
          </Link>
        </span>
      )}
    </span>
  )
}

function Plain({ text }: { text: string }) {
  const allowed = useContext(TermsContext)
  if (allowed.size === 0) return <>{text}</>
  const out: ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(TERM_PATTERN)) {
    const id = termIdOf(match[1])
    if (!id || !allowed.has(id)) continue
    out.push(text.slice(last, match.index))
    out.push(
      <Term key={`${id}-${match.index}`} id={id}>
        {match[1]}
      </Term>,
    )
    last = match.index + match[0].length
  }
  out.push(text.slice(last))
  return <>{out}</>
}

function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(INLINE_CODE).map((part, index) =>
        index % 2 === 1 ? (
          <code key={index} className="guide-inline-code">
            {part.startsWith('`') ? part.slice(1, -1) : part}
          </code>
        ) : (
          <Plain key={index} text={part} />
        ),
      )}
    </>
  )
}

/** All the plain text of a prose block (code spans taken out), to find which glossary words it uses. */
function proseText(nodes: ProseNode[]): string {
  return nodes
    .flatMap((node) => (node.type === 'p' ? [node.text] : node.type === 'list' ? node.items : []))
    .join('\n')
    .replace(/`[^`]*`/g, ' ')
}

function Prose({ nodes }: { nodes: ProseNode[] }) {
  return (
    <div className="guide-prose">
      {nodes.map((node, index) => {
        switch (node.type) {
          case 'sub':
            return (
              <h3 key={index} className="guide-sub">
                {node.text}
              </h3>
            )
          case 'pre':
            return (
              <pre key={index} className="guide-pre" tabIndex={0}>
                {node.text}
              </pre>
            )
          case 'list': {
            const List = node.ordered ? 'ol' : 'ul'
            return (
              <List key={index} className={node.ordered ? 'guide-list guide-list-ordered' : 'guide-list'}>
                {node.items.map((item, i) => (
                  <li key={i}>
                    <Inline text={item} />
                  </li>
                ))}
              </List>
            )
          }
          default:
            return node.callout ? (
              <div key={index} role="note" className="guide-callout" data-kind={node.callout.toLowerCase().replace(/\s+/g, '-')}>
                <p className={node.breaks ? 'guide-breaks' : undefined}>
                  <span className="guide-callout-label">{node.callout}.</span>
                  <Inline text={node.text} />
                </p>
              </div>
            ) : (
              <p key={index} className={node.breaks ? 'guide-breaks' : undefined}>
                <Inline text={node.text} />
              </p>
            )
        }
      })}
    </div>
  )
}

function Banner({ kind, sections }: { kind: 'learn' | 'practice' | 'note'; sections: BannerSection[] }) {
  return (
    <section className={cn('guide-card', kind === 'practice' && 'guide-card-practice')}>
      {sections.map((section, index) => (
        <div key={index} className={index > 0 ? 'mt-4' : undefined}>
          {section.heading && (
            <h2 className="guide-card-title">
              {section.heading}
              {section.subtitle && <span className="guide-card-subtitle"> {section.subtitle}</span>}
            </h2>
          )}
          {groupItems(section).map((group, gi) =>
            group.type === 'text' ? (
              <p key={gi} className="guide-card-text">
                <Inline text={group.text} />
              </p>
            ) : group.type === 'pre' ? (
              <pre key={gi} className="guide-pre" tabIndex={0}>
                {group.text}
              </pre>
            ) : (
              <ul key={gi} className={cn('guide-card-list', group.ordered && 'guide-card-list-ordered')}>
                {group.items.map((item, ii) => (
                  <li key={ii}>
                    <Inline text={item} />
                  </li>
                ))}
              </ul>
            ),
          )}
        </div>
      ))}
    </section>
  )
}

type ItemGroup =
  | { type: 'text'; text: string }
  | { type: 'pre'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }

// Consecutive bullets (or numbers) become one list; text and preformatted lines stay as they are.
function groupItems(section: BannerSection): ItemGroup[] {
  const groups: ItemGroup[] = []
  for (const item of section.items) {
    if (item.kind === 'bullet' || item.kind === 'number') {
      const ordered = item.kind === 'number'
      const last = groups[groups.length - 1]
      if (last?.type === 'list' && last.ordered === ordered) last.items.push(item.text)
      else groups.push({ type: 'list', ordered, items: [item.text] })
    } else {
      groups.push(item.kind === 'pre' ? { type: 'pre', text: item.text } : { type: 'text', text: item.text })
    }
  }
  return groups
}


// One code block's own run bar. Every block is a complete script, so "Run" shows what it printed when Node ran
// it for real (captured while the site was built, instantly), and a block with several scenarios lets the
// reader pick which one to look at.
function PartRun({
  run,
  open,
  onToggle,
  scenario,
  onScenario,
  onLive,
  liveOnly,
}: {
  run: BlockRun
  open: boolean
  onToggle: () => void
  scenario: number
  onScenario: (index: number) => void
  /** Open the block as an editor and, with `true`, run it at once. */
  onLive: (andRun: boolean) => void
  /** The whole file at the bottom: no stored output, only Edit and run. */
  liveOnly?: boolean
}) {
  const current = run.scenarios[Math.min(scenario, run.scenarios.length - 1)]
  // Output and error text interleave in the order they happened; the error stream is drawn as an error.
  const pieces: { text: string; error: boolean }[] = []
  for (const [, text, stream] of current?.segments ?? []) {
    const error = stream === 1
    const last = pieces[pieces.length - 1]
    if (last && last.error === error) last.text += text
    else pieces.push({ text, error })
  }
  return (
    <>
      <div className="guide-part-bar">
        <div className="flex flex-wrap items-center gap-2">
          {!liveOnly && (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            className={cn(
              'flex min-h-6 cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[13px] transition-colors',
              open
                ? 'border-[var(--color-code-accent-glow)] bg-[var(--color-code-accent-glow)]/20 text-[var(--color-code-accent-soft)]'
                : 'border-[var(--color-code-border)] bg-[var(--color-code-surface)] text-[var(--color-code-ink-dim)] hover:border-[var(--color-code-border-strong)] hover:bg-[var(--color-code-surface-hover)] hover:text-[var(--color-code-ink)]',
            )}
          >
            <Play className="h-3 w-3" aria-hidden /> {open ? 'Hide output' : 'Show output'}
          </button>
          )}
          {open && run.scenarios.length > 1 && (
            <div className="flex items-center gap-2 text-xs text-[var(--color-code-ink-faint)]">
              <span>Typed input</span>
              <div className="min-w-[8.5rem]">
                <Dropdown
                  tone="code"
                  compact
                  ariaLabel="Typed input"
                  value={Math.min(scenario, run.scenarios.length - 1)}
                  onChange={onScenario}
                  options={run.scenarios.map((s, index) => ({
                    value: index,
                    label: s.label || `Input ${index + 1}`,
                    description: s.inputs.length ? `Types: ${s.inputs.join(', ')}` : undefined,
                  }))}
                />
              </div>
            </div>
          )}
        </div>
        {run.editable !== false && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onLive(false)}
              className="flex min-h-6 cursor-pointer items-center gap-1.5 rounded-md border border-[var(--color-code-border)] bg-[var(--color-code-surface)] px-2.5 py-0.5 text-[13px] text-[var(--color-code-ink-dim)] transition-colors hover:border-[var(--color-code-border-strong)] hover:bg-[var(--color-code-surface-hover)] hover:text-[var(--color-code-ink)]"
              title="Change the code and run your own version, live in your browser"
            >
              <PencilLine className="h-3 w-3" aria-hidden /> {liveOnly ? 'Edit and run' : 'Edit'}
            </button>
          </div>
        )}
      </div>
      {open && !liveOnly && (
        <div className="guide-part-out" role="region" aria-label="Output of this block">
          {pieces.length > 0 && <p className="live-meta live-caption">Sample output</p>}
          {pieces.length ? (
            <pre tabIndex={0}>
              {pieces.map((piece, index) => (
                <span key={index} className={piece.error ? 'live-err' : undefined}>
                  {piece.text}
                </span>
              ))}
            </pre>
          ) : (
            <p className="guide-part-none">This block prints nothing.</p>
          )}
        </div>
      )}
    </>
  )
}

export function GuidedLesson({ leading, blocks: sourceBlocks, code, path, filename, topics, output: sourceOutput, focusLine, notes }: GuidedLessonProps) {
  // A plain practice file with its questions marked ("// --- 2. Title ---") is shown as one section per question,
  // each with a heading, its explanation, the code and its preloaded output, like the other guides.
  const practice = useMemo(
    () => (PRACTICE_VIEW && sourceBlocks.every((b) => b.type === 'code') ? practiceToGuide(code, path) : null),
    [sourceBlocks, code, path],
  )
  const blocks = practice?.blocks ?? sourceBlocks
  // A practice file taught question by question shows no stored output (the Capture dialog still uses it).
  const output = practice ? undefined : sourceOutput
  const [siteTheme] = useTheme()
  const [chunks, setChunks] = useState<Record<number, string>>({})
  // The sample output under a block starts hidden, so a prediction is not given away. The reader opens it.
  const [shownParts, setShownParts] = useState<Set<number>>(() => new Set())
  // Blocks the reader opened as a live editor, and whether pressing Run on them started the program at once.
  const [live, setLive] = useState<Map<number, boolean>>(() => new Map())
  const [scenarios, setScenarios] = useState<Record<number, number>>({})

  const togglePart = (line: number) =>
    setShownParts((current) => {
      const next = new Set(current)
      if (!next.delete(line)) next.add(line)
      return next
    })

  const codeBlocks = useMemo(
    () => blocks.filter((b): b is Extract<LessonBlock, { type: 'code' }> => b.type === 'code'),
    [blocks],
  )

  // Which glossary words each block of explanation may underline: the first block to use a word gets it.
  const termsByBlock = useMemo(() => {
    const seen = new Set<string>()
    const byBlock = new Map<number, Set<string>>()
    for (const block of blocks) {
      if (block.type !== 'prose') continue
      const fresh = termsIn(proseText(block.nodes)).filter((id) => !seen.has(id))
      fresh.forEach((id) => seen.add(id))
      if (fresh.length) byBlock.set(block.line, new Set(fresh))
    }
    return byBlock
  }, [blocks])

  useEffect(() => {
    let cancelled = false
    getHighlighter().then((highlighter) => {
      if (cancelled) return
      const next: Record<number, string> = {}
      for (const block of codeBlocks) {
        next[block.line] = highlighter.codeToHtml(block.code, {
          lang: langForFile(filename),
          theme: SHIKI_THEME_BY_SITE_THEME[siteTheme],
          transformers: [chunkTransformer(block.line)],
        })
      }
      setChunks(next)
    })
    return () => {
      cancelled = true
    }
  }, [codeBlocks, siteTheme])

  // Jump to a line from a search result / link. Prose has no per-line elements, so
  // fall back to the nearest earlier line that exists.
  const ready = Object.keys(chunks).length > 0
  useEffect(() => {
    if (!ready || !focusLine) return
    for (let n = focusLine; n >= 1; n--) {
      const el = document.getElementById(`L${n}`)
      if (!el) continue
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('line-flash')
      const timer = window.setTimeout(() => el.classList.remove('line-flash'), 1800)
      return () => window.clearTimeout(timer)
    }
  }, [ready, focusLine])

  const body: ReactNode[] = blocks.map((block) => {
    switch (block.type) {
      case 'banner':
        return (
          <div key={`b${block.line}`} id={`L${block.line}`}>
            <Banner kind={block.kind} sections={block.sections} />
          </div>
        )
      case 'topic':
        return (
          <h2 key={`t${block.line}`} id={`L${block.line}`} className="guide-topic">
            {block.eyebrow && <span className="guide-topic-num">{block.eyebrow.replace(/^Topic\s+/, '')}</span>}
            {block.title}
          </h2>
        )
      case 'prose':
        return (
          <div key={`p${block.line}`} id={`L${block.line}`} className="scroll-mt-24">
            <TermsContext.Provider value={termsByBlock.get(block.line) ?? NO_TERMS}>
              <Prose nodes={block.nodes} />
            </TermsContext.Provider>
          </div>
        )
      case 'markdown':
        return (
          <div key={`m${block.line}`} className="scroll-mt-24">
            <NotesView markdown={block.markdown} />
          </div>
        )
      case 'code': {
        const run = block.full ? (block.full.canRun ? FULL_FILE_RUN : undefined) : output?.runs.blocks[String(block.line)]
        const editing = live.has(block.line)
        return (
          <div
            key={`c${block.line}`}
            className="guide-code code-font"
            style={{ ['--line-start' as string]: block.line - 1 }}
          >
            {editing ? (
              <Suspense fallback={<p className="guide-part-none">Opening the editor...</p>}>
                <LiveJs
                  initialCode={block.code}
                  firstLine={block.line}
                  autoRun={live.get(block.line)}
                  label={`Editable JavaScript code, lesson line ${block.line}`}
                  onClose={() =>
                    setLive((current) => {
                      const next = new Map(current)
                      next.delete(block.line)
                      return next
                    })
                  }
                />
              </Suspense>
            ) : (
              <>
                {chunks[block.line] ? (
                  <div className="overflow-x-auto py-2.5" tabIndex={0} role="group" aria-label="Code, scrollable" dangerouslySetInnerHTML={{ __html: chunks[block.line] }} />
                ) : (
                  <pre className="overflow-x-auto px-4 py-2.5 font-mono text-[var(--color-code-ink-dim)]" tabIndex={0}>{block.code}</pre>
                )}
                {run && (
                  <PartRun
                    run={run}
                    open={shownParts.has(block.line)}
                    onToggle={() => togglePart(block.line)}
                    liveOnly={Boolean(block.full)}
                    scenario={scenarios[block.line] ?? 0}
                    onScenario={(index) => setScenarios((current) => ({ ...current, [block.line]: index }))}
                    onLive={(andRun) => {
                      jsRunner.prepare()
                      setLive((current) => new Map(current).set(block.line, andRun))
                    }}
                  />
                )}
              </>
            )}
          </div>
        )
      }
    }
  })

  return (
    <div className="guide">
      <div className="guide-toolbar" data-code-actions>
        {leading ?? <span className="font-mono text-xs text-[var(--color-code-ink-faint)]">{filename}</span>}
        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden sm:contents">
            <FontSizeControl />
          </span>
          <CopyButton text={code} />
          <span className="hidden sm:contents">
            <CaptureDialogButton code={code} filename={filename} topics={topics} output={sourceOutput} />
          </span>
        </div>
      </div>

      <div className="guide-body">
        {notes && (
          <>
            <div className="notes-jump">
              <button type="button" onClick={() => document.getElementById('your-code')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                Jump to your code <ArrowDown className="h-3 w-3" aria-hidden />
              </button>
            </div>
            {notes}
            <h2 id="your-code" className="guide-topic scroll-mt-24">
              Your code
            </h2>
            {filename.endsWith('.jsx') && (
              <div className="guide-prose">
                <p>
                  This is React code. It runs in your own Vite project (<code>npm run dev</code> inside <code>phase2-react/app</code>), not in this page,
                  so there is no run button. The code is shown as written.
                </p>
              </div>
            )}
            {practice && (
              <div className="guide-prose">
                <p>
                  Your exercises from this lesson, one at a time: the task, the code you wrote, and an explanation. The whole file is at the
                  bottom.
                </p>
              </div>
            )}
          </>
        )}
        {body}
      </div>
    </div>
  )
}
