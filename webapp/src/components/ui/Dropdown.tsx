import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface DropdownOption<T extends string | number> {
  value: T
  label: string
  description?: string
  icon?: ReactNode
}

interface DropdownProps<T extends string | number> {
  /** The chosen value, or null to show the placeholder (a menu of actions rather than a setting). */
  value: T | null
  options: DropdownOption<T>[]
  onChange: (value: T) => void
  ariaLabel: string
  placeholder?: string
  /** 'code' draws it in the palette of a lesson's code blocks, for use inside one. */
  tone?: 'page' | 'code'
  /** A smaller button, for a toolbar. */
  compact?: boolean
}

// A themed replacement for <select>. The browser draws a native select's list itself, as a
// light system panel, which clashes with every dark theme and made the text unreadable here.
// The list is portaled to the page and positioned from the button, so it is never clipped by
// a scrolling or overflow-hidden parent such as a dialog.
export function Dropdown<T extends string | number>({ value, options, onChange, ariaLabel, placeholder = 'Choose...', tone = 'page', compact = false }: DropdownProps<T>) {
  const code = tone === 'code'
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [position, setPosition] = useState<CSSProperties | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const id = useId()
  const selectedIndex = options.findIndex((option) => option.value === value)
  const current = selectedIndex >= 0 ? options[selectedIndex] : null

  function openList() {
    const trigger = triggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const below = window.innerHeight - rect.bottom - 12
    const above = rect.top - 12
    const flip = below < 200 && above > below
    // A narrow button (a toolbar's) still gets a list wide enough to read, kept inside the window.
    const width = Math.max(rect.width, compact ? 176 : rect.width)
    setPosition({
      position: 'fixed',
      left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)),
      width,
      maxHeight: Math.max(140, Math.min(320, flip ? above : below)),
      ...(flip ? { bottom: window.innerHeight - rect.top + 6 } : { top: rect.bottom + 6 }),
    })
    setActive(Math.max(0, selectedIndex))
    setOpen(true)
  }

  function close(refocus: boolean) {
    setOpen(false)
    if (refocus) triggerRef.current?.focus()
  }

  function choose(index: number) {
    onChange(options[index].value)
    close(true)
  }

  // Land keyboard focus on the list so arrow keys work straight away.
  useEffect(() => {
    if (open) listRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (!listRef.current?.contains(target) && !triggerRef.current?.contains(target)) setOpen(false)
    }
    const dismiss = () => setOpen(false)
    // The list is positioned from the button when it opens, so it only needs to close if the button
    // moves (the page or dialog behind it scrolled). Scrolling the list itself must never close it:
    // a scroll event from the list also reaches this window-level listener.
    const anchor = triggerRef.current?.getBoundingClientRect()
    const handleScroll = (event: Event) => {
      if (listRef.current?.contains(event.target as Node)) return
      const now = triggerRef.current?.getBoundingClientRect()
      if (!anchor || !now || Math.abs(now.top - anchor.top) > 1 || Math.abs(now.left - anchor.left) > 1) setOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('resize', dismiss)
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('resize', dismiss)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [open])

  useEffect(() => {
    if (open) document.getElementById(`${id}-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active, id])

  function handleTriggerKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (!open) openList()
    }
  }

  function handleListKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActive((i) => (i + 1) % options.length)
        break
      case 'ArrowUp':
        event.preventDefault()
        setActive((i) => (i - 1 + options.length) % options.length)
        break
      case 'Home':
        event.preventDefault()
        setActive(0)
        break
      case 'End':
        event.preventDefault()
        setActive(options.length - 1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        choose(active)
        break
      case 'Escape':
        // Stop here so a surrounding dialog doesn't also close.
        event.preventDefault()
        event.stopPropagation()
        close(true)
        break
      case 'Tab':
        close(false)
        break
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${ariaLabel}${current ? `: ${current.label}` : ''}`}
        onClick={() => (open ? close(false) : openList())}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          'flex w-full cursor-pointer items-center gap-2 rounded-md border text-left transition-colors',
          compact ? 'min-h-6 px-2 py-0.5 text-[13px]' : 'h-8 px-2.5 text-sm',
          code
            ? 'border-[var(--color-code-border)] bg-[var(--color-code-surface)] hover:border-[var(--color-code-border-strong)] focus-visible:border-[var(--color-code-accent-soft)]'
            : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] focus-visible:border-[var(--color-accent)]',
        )}
      >
        {current?.icon}
        <span
          className={cn(
            'min-w-0 flex-1 truncate',
            current ? (code ? 'text-[var(--color-code-ink)]' : 'text-[var(--color-ink)]') : code ? 'text-[var(--color-code-ink-faint)]' : 'text-[var(--color-ink-faint)]',
          )}
        >
          {current ? current.label : placeholder}
        </span>
        <ChevronDown className={cn('h-3.5 w-3.5 shrink-0 transition-transform', code ? 'text-[var(--color-code-ink-faint)]' : 'text-[var(--color-ink-faint)]', open && 'rotate-180')} />
      </button>

      {open &&
        position &&
        createPortal(
          <div
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            aria-label={ariaLabel}
            aria-activedescendant={`${id}-${active}`}
            onKeyDown={handleListKeyDown}
            style={position}
            className={cn(
              'z-[95] overflow-y-auto border p-1 shadow-[var(--shadow-glass)] outline-none',
              code
                ? 'rounded-lg border-[var(--color-code-border-strong)] bg-[var(--color-code-bg)]'
                : 'rounded-xl border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)]',
            )}
          >
            {options.map((option, index) => (
              <div
                key={String(option.value)}
                id={`${id}-${index}`}
                role="option"
                aria-selected={option.value === value}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(index)}
                className={cn(
                  'flex cursor-pointer items-center gap-2.5 px-2.5 text-sm transition-colors',
                  compact ? 'rounded-md py-1.5 text-[13px]' : 'rounded-lg py-2',
                  code
                    ? index === active
                      ? 'bg-[var(--color-code-surface-hover)] text-[var(--color-code-ink)]'
                      : 'text-[var(--color-code-ink-dim)]'
                    : index === active
                      ? 'bg-[var(--color-surface-hover)] text-[var(--color-ink)]'
                      : 'text-[var(--color-ink-dim)]',
                  option.value === value && (code ? 'text-[var(--color-code-accent-soft)]' : 'text-[var(--color-accent-soft)]'),
                )}
              >
                {option.icon}
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{option.label}</span>
                  {option.description && (
                    <span className={cn('block truncate text-[11px]', code ? 'text-[var(--color-code-ink-faint)]' : 'text-[var(--color-ink-faint)]')}>{option.description}</span>
                  )}
                </span>
                {option.value === value && <Check className="h-3.5 w-3.5 shrink-0" />}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </>
  )
}
