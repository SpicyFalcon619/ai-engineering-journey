import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { Marked } from 'marked'
import type { HighlighterCore } from 'shiki/core'
import { getHighlighter, SHIKI_THEME_BY_SITE_THEME } from '@/lib/highlighter'
import { getTerm, TERM_PATTERN, termIdOf } from '@/lib/glossary'
import { useTheme } from '@/hooks/useTheme'
import { makeSlugger } from '@/lib/notes'

// The lesson's explanation: the author's study notes (phase1-javascript/NOTES.md), drawn as readable text. Each
// JavaScript example in them can be copied, or sent to the Sandbox to be edited and run.

const SANDBOX_KEY = 'aefg-sandbox-code'
const JS_LANGS = new Set(['js', 'javascript', 'mjs'])

const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const decode = (text: string) => text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')

// Where a glossary word is never underlined: code, links, buttons and headings.
const NO_TERMS_IN = 'pre, code, a, button, h1, h2, h3, h4, h5, h6'

/**
 * Underlines the glossary words in the notes' text. A word is underlined the first time it appears in each section
 * (each "##" heading), so the page is not full of underlines but a word is never far from its meaning.
 */
function underlineTerms(html: string): string {
  const doc = new DOMParser().parseFromString(`<div id="root">${html}</div>`, 'text/html')
  const root = doc.getElementById('root')
  if (!root) return html
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT)
  const nodes: Node[] = []
  while (walker.nextNode()) nodes.push(walker.currentNode)

  const seen = new Set<string>()
  for (const node of nodes) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if ((node as Element).tagName === 'H2') seen.clear()
      continue
    }
    const text = node as Text
    if (!text.parentElement || text.parentElement.closest(NO_TERMS_IN)) continue
    const value = text.data
    const parts: (string | { id: string; word: string })[] = []
    let last = 0
    for (const match of value.matchAll(TERM_PATTERN)) {
      const id = termIdOf(match[1])
      if (!id || seen.has(id)) continue
      seen.add(id)
      parts.push(value.slice(last, match.index), { id, word: match[1] })
      last = (match.index ?? 0) + match[0].length
    }
    if (parts.length === 0) continue
    parts.push(value.slice(last))
    const fragment = doc.createDocumentFragment()
    for (const part of parts) {
      if (typeof part === 'string') {
        fragment.append(part)
        continue
      }
      const wrap = doc.createElement('span')
      wrap.className = 'guide-term-wrap'
      const button = doc.createElement('button')
      button.type = 'button'
      button.className = 'guide-term'
      button.dataset.term = part.id
      button.textContent = part.word
      wrap.append(button)
      fragment.append(wrap)
    }
    text.replaceWith(fragment)
  }
  return root.innerHTML
}

function render(markdown: string, highlighter: HighlighterCore | null, theme: string): string {
  // The same slugger the outline uses, called in the same order, so every heading gets the id the outline links to.
  const slug = makeSlugger()
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }) {
        const inner = this.parser.parseInline(tokens)
        return `<h${depth} id="${slug(decode(inner.replace(/<[^>]+>/g, '')))}">${inner}</h${depth}>\n`
      },
      code({ text, lang }) {
        const isJs = JS_LANGS.has((lang ?? '').toLowerCase())
        const body =
          isJs && highlighter
            ? highlighter.codeToHtml(text, { lang: 'javascript', theme })
            : `<pre class="notes-plain"><code>${escapeHtml(text)}</code></pre>`
        const actions = isJs
          ? `<button type="button" data-notes-try>Try it in the Sandbox</button><button type="button" data-notes-copy>Copy</button>`
          : `<button type="button" data-notes-copy>Copy</button>`
        return `<div class="notes-code code-font" data-code="${escapeHtml(text)}"><div class="notes-code-bar">${actions}</div>${body}</div>\n`
      },
      link({ href, title, tokens }) {
        const inner = this.parser.parseInline(tokens)
        const external = /^https?:\/\//.test(href)
        return `<a href="${escapeHtml(href)}"${title ? ` title="${escapeHtml(title)}"` : ''}${external ? ' target="_blank" rel="noreferrer"' : ''}>${inner}</a>`
      },
    },
  })
  const html = marked.parse(markdown, { async: false }).replace(/<table>/g, '<div class="notes-table"><table>').replace(/<\/table>/g, '</table></div>')
  return underlineTerms(html)
}

interface Popover {
  id: string
  left: number
  top: number
}

const PHONE_WIDTH = 640

export function NotesView({ markdown }: { markdown: string }) {
  const [siteTheme] = useTheme()
  const navigate = useNavigate()
  const [highlighter, setHighlighter] = useState<HighlighterCore | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [pop, setPop] = useState<Popover | null>(null)
  const closing = useRef(0)

  useEffect(() => {
    let cancelled = false
    getHighlighter().then((h) => {
      if (!cancelled) setHighlighter(h)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Plain text first, then the same text with its code coloured once the highlighter has loaded.
  const html = useMemo(() => render(markdown, highlighter, SHIKI_THEME_BY_SITE_THEME[siteTheme]), [markdown, highlighter, siteTheme])

  // A glossary word: hover (mouse) or tap shows its short meaning. The card is placed by the word, and kept on screen.
  function openTerm(button: HTMLElement) {
    const id = button.dataset.term
    if (!id) return
    window.clearTimeout(closing.current)
    const rect = button.getBoundingClientRect()
    setPop({ id, left: Math.max(12, Math.min(rect.left, window.innerWidth - 348)), top: rect.bottom + 6 })
  }
  const closeSoon = () => {
    window.clearTimeout(closing.current)
    closing.current = window.setTimeout(() => setPop(null), 180)
  }

  useEffect(() => {
    if (!pop) return
    const outside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.guide-term, .guide-term-pop')) setPop(null)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPop(null)
    }
    const away = () => setPop(null)
    document.addEventListener('mousedown', outside)
    document.addEventListener('keydown', escape)
    window.addEventListener('scroll', away, { passive: true })
    return () => {
      document.removeEventListener('mousedown', outside)
      document.removeEventListener('keydown', escape)
      window.removeEventListener('scroll', away)
    }
  }, [pop])
  useEffect(() => () => window.clearTimeout(closing.current), [])

  function onPointerOver(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') return
    const button = (event.target as HTMLElement).closest<HTMLElement>('.guide-term')
    if (button) openTerm(button)
  }
  function onPointerOut(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') return
    if ((event.target as HTMLElement).closest('.guide-term')) closeSoon()
  }

  function onClick(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement
    const term = target.closest<HTMLElement>('.guide-term')
    if (term) {
      if (pop && pop.id === term.dataset.term) setPop(null)
      else openTerm(term)
      return
    }
    const box = target.closest<HTMLElement>('.notes-code')
    if (!box) return
    const code = box.dataset.code ?? ''
    if (target.closest('[data-notes-try]')) {
      try {
        window.localStorage.setItem(SANDBOX_KEY, code + '\n')
      } catch {
        // The Sandbox then opens with its own starting example, which is fine.
      }
      navigate('/sandbox')
    } else if (target.closest('[data-notes-copy]')) {
      void navigator.clipboard?.writeText(code).then(() => {
        setCopied(code)
        window.setTimeout(() => setCopied((current) => (current === code ? null : current)), 1500)
      })
    }
  }

  // The copy button says "Copied" for a moment. It lives in the HTML string, so it is updated directly.
  useEffect(() => {
    document.querySelectorAll<HTMLElement>('.notes-code').forEach((box) => {
      const button = box.querySelector<HTMLElement>('[data-notes-copy]')
      if (button) button.textContent = box.dataset.code === copied ? 'Copied' : 'Copy'
    })
  }, [copied, html])

  const entry = pop ? getTerm(pop.id) : undefined
  const phone = typeof window !== 'undefined' && window.innerWidth <= PHONE_WIDTH

  return (
    <>
      <div className="notes-md" onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut} dangerouslySetInnerHTML={{ __html: html }} />
      {pop &&
        entry &&
        // Drawn on the page itself, not inside the lesson: the lesson fades in with a transform, and a transformed
        // ancestor would become the reference for `position: fixed`, shifting the card away from its word.
        createPortal(
          <span
            role="tooltip"
            className="guide-term-pop"
            // On a phone the card slides up from the bottom (see the stylesheet); elsewhere it sits beside the word.
            style={phone ? undefined : { position: 'fixed', top: pop.top, left: pop.left }}
            onPointerEnter={() => window.clearTimeout(closing.current)}
            onPointerLeave={closeSoon}
          >
            <strong>{entry.term}</strong> {entry.short}{' '}
            <Link to={`/glossary?term=${pop.id}`} className="guide-term-more">
              More in the glossary
            </Link>
          </span>,
          document.body,
        )}
    </>
  )
}
