import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Marked } from 'marked'
import type { HighlighterCore } from 'shiki/core'
import { getHighlighter, SHIKI_THEME_BY_SITE_THEME } from '@/lib/highlighter'
import { useTheme } from '@/hooks/useTheme'
import { makeSlugger } from '@/lib/notes'

// The lesson's explanation: the author's study notes (phase1-javascript/NOTES.md), drawn as readable text. Each
// JavaScript example in them can be copied, or sent to the Sandbox to be edited and run.

const SANDBOX_KEY = 'aefg-sandbox-code'
const JS_LANGS = new Set(['js', 'javascript', 'mjs'])

const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const decode = (text: string) => text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')

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
  return marked.parse(markdown, { async: false }).replace(/<table>/g, '<div class="notes-table"><table>').replace(/<\/table>/g, '</table></div>')
}

export function NotesView({ markdown }: { markdown: string }) {
  const [siteTheme] = useTheme()
  const navigate = useNavigate()
  const [highlighter, setHighlighter] = useState<HighlighterCore | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

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

  function onClick(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement
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

  return <div className="notes-md" onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />
}
