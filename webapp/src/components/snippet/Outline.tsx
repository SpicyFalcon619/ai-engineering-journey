import { useEffect, useMemo, useState } from 'react'
import type { Snippet } from '@/types'
import type { NoteHeading } from '@/lib/notes'
import { jumpToLine } from '@/lib/scroll'
import { cn } from '@/lib/cn'

// How far below the top of the viewport a section heading counts as "current".
// Leaves room for the code window's sticky header.
const SPY_OFFSET_PX = 110

interface Entry {
  /** The id of the element on the page that this entry points at. */
  id: string
  label: string
  /** 3 is a sub-section of the one above it. */
  depth: number
  go: () => void
}

const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

// A lesson's table of contents, with the section you are reading highlighted as you scroll. It lists the headings of
// the lesson's notes when there are notes (ending with "Your code"), and otherwise the lesson's own `### Topic ###`
// sections. Shown beside the lesson on wide screens; narrower screens keep the jump chips under the title.
export function Outline({ snippet, notes = [] }: { snippet: Snippet; notes?: NoteHeading[] }) {
  const [active, setActive] = useState<string | null>(null)
  const { topics } = snippet

  const entries = useMemo<Entry[]>(() => {
    if (notes.length > 0) {
      return [
        ...notes.map((h) => ({ id: h.id, label: h.label, depth: h.depth, go: () => scrollToId(h.id) })),
        { id: 'your-code', label: 'Your code', depth: 2, go: () => scrollToId('your-code') },
      ]
    }
    return topics.map((t) => ({ id: `L${t.line}`, label: t.label, depth: 2, go: () => jumpToLine(t.line) }))
  }, [notes, topics])

  useEffect(() => {
    if (entries.length === 0) return
    let frame = 0

    function update() {
      let current: string | null = null
      for (const entry of entries) {
        const el = document.getElementById(entry.id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= SPY_OFFSET_PX) current = entry.id
        else break
      }
      setActive(current)
    }
    function onScroll() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    // The code is highlighted asynchronously, so its lines appear a moment
    // after mount; measure again once they exist.
    const timers = [300, 900, 2000].map((ms) => window.setTimeout(update, ms))
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
      timers.forEach(window.clearTimeout)
    }
  }, [entries])

  return (
    <aside aria-label="In this lesson" className="sticky top-6 hidden max-h-[calc(100vh-3rem)] self-start overflow-y-auto xl:block">
      <h2 className="mb-3 text-sm font-semibold text-[var(--color-ink)]">
        In this lesson
      </h2>
      {entries.length > 0 ? (
        <ol className="flex flex-col border-l border-[var(--color-border)]">
          {entries.map((entry) => {
            const isActive = entry.id === active
            return (
              <li key={entry.id}>
                <button
                  onClick={entry.go}
                  aria-current={isActive ? 'location' : undefined}
                  className={cn(
                    '-ml-px block w-full cursor-pointer border-l py-1.5 pr-2 text-left text-[13px] leading-snug transition-colors',
                    entry.depth >= 3 ? 'pl-6' : 'pl-3',
                    isActive
                      ? 'border-[var(--color-accent)] text-[var(--color-ink)]'
                      : 'border-transparent text-[var(--color-ink-faint)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink-dim)]',
                  )}
                >
                  {entry.label}
                </button>
              </li>
            )
          })}
        </ol>
      ) : (
        <p className="text-[13px] leading-relaxed text-[var(--color-ink-faint)]">
          One continuous example, {snippet.lineCount} lines. Press Run on the code to see its output.
        </p>
      )}
    </aside>
  )
}
