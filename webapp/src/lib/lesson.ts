// Turns a lesson .java file into a "guided" document: the explanations that live in
// its /// comments become prose, and the code between them becomes blocks.
// The .java file stays the single source of truth; nothing is duplicated.
//
// Conventions the parser understands (all optional):
//   - A leading /* title comment */ is the title, handled elsewhere, and skipped here.
//   - A comment block fenced by `/// =====` lines is a card. One whose first line is
//     "WHAT YOU WILL LEARN" or "YOUR TURN ..." gets that card style.
//   - `/// ### Topic 1: Title ###` starts a section.
//   - Lines starting with /// at column 0 are prose. Ordinary // comments are always code, wherever they sit.
//   - Every block is a complete program. Typed input for it follows the block:
//     `/// @input Noman | 35` (one line per Scanner call; each @input line is one scenario, and
//     `/// @input(Label): ...` names it). A file it needs: `/// @file example.txt: first | second`.
//   - In prose: `- item` / `1. item` lines make lists, lines with a run of spaces
//     (aligned columns, diagrams) stay preformatted, `/// --- Title ----` is a sub-heading.

export type ProseNode =
  | { type: 'p'; text: string; callout?: string; breaks?: boolean }
  | { type: 'pre'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'sub'; text: string }

export interface BannerItem {
  kind: 'bullet' | 'number' | 'text' | 'pre'
  text: string
}

export interface BannerSection {
  heading?: string
  subtitle?: string
  items: BannerItem[]
}

export type LessonBlock =
  | { type: 'banner'; kind: 'learn' | 'practice' | 'note'; line: number; sections: BannerSection[] }
  | { type: 'topic'; line: number; eyebrow?: string; title: string }
  | { type: 'prose'; line: number; nodes: ProseNode[] }
  | { type: 'code'; line: number; code: string; inputs?: InputScenario[]; files?: PreparedFile[]; full?: { canRun: boolean } }
  /** Written explanation in markdown (a practice file's explanation of a question), drawn like the study notes. */
  | { type: 'markdown'; line: number; markdown: string }

/** One run of a block: the lines typed for its Scanner calls. */
export interface InputScenario {
  label: string
  lines: string[]
}

/** A file that exists before a block runs, so a program can read it. */
export interface PreparedFile {
  name: string
  content: string
}

const BANNER_RULE = /^#\s*={10,}\s*$/
const TOPIC_RULE = /^#{2,}\s*(.+?)\s*#{2,}$/
const CALLOUT_RULE = /^(NOTE|WARNING|TIP|IMPORTANT|WHY|MISTAKE|ANALOGY|JARGON|REMEMBER|TRY IT|Debugging tip|Rule of thumb)\b:?\s*/
const LIST_MARKER = /^(\s*)(-|\d+\.)\s+(.*)$/
const ALIGNED = /\S {3,}\S/

const stripHash = (line: string) => line.replace(/^#\s?/, '')

function sentenceCase(text: string) {
  const lower = text.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

function dedent(lines: string[]): string {
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^ */)![0].length)
  const cut = indents.length ? Math.min(...indents) : 0
  return lines.map((l) => l.slice(cut)).join('\n')
}

function parseList(run: string[]): ProseNode {
  const first = run[0].match(LIST_MARKER)
  const baseIndent = first ? first[1].length : 0
  const items: string[] = []
  for (const line of run) {
    const m = line.match(LIST_MARKER)
    if (m && m[1].length <= baseIndent + 1) items.push(m[3].trim())
    else if (items.length) items[items.length - 1] += ' ' + line.trim()
  }
  return { type: 'list', ordered: /^\s*\d/.test(run[0]), items }
}

function proseNodes(raw: string[]): ProseNode[] {
  const nodes: ProseNode[] = []
  let para: string[] = []
  let run: string[] = []

  const flushPara = () => {
    if (!para.length) return
    if (para.some((l) => ALIGNED.test(l))) {
      nodes.push({ type: 'pre', text: para.join('\n') })
    } else {
      // A double space inside a line means "these lines are separate thoughts": keep the breaks.
      const breaks = para.some((l) => /\S {2}\S/.test(l))
      const text = para.join(breaks ? '\n' : ' ')
      const m = text.match(CALLOUT_RULE)
      if (m) nodes.push({ type: 'p', text: text.slice(m[0].length), callout: m[1], breaks })
      else nodes.push({ type: 'p', text, breaks })
    }
    para = []
  }
  const flushRun = () => {
    if (!run.length) return
    nodes.push(LIST_MARKER.test(run[0]) ? parseList(run) : { type: 'pre', text: dedent(run) })
    run = []
  }

  for (const t of raw) {
    if (!t.trim()) {
      flushPara()
      flushRun()
      continue
    }
    const sub = t.match(/^---+\s+(.+?)\s+-{3,}$/)
    if (sub) {
      flushPara()
      flushRun()
      nodes.push({ type: 'sub', text: sub[1] })
    } else if (/^\s{2,}/.test(t)) {
      flushPara()
      run.push(t)
    } else {
      flushRun()
      para.push(t)
    }
  }
  flushPara()
  flushRun()
  return nodes
}

function parseBanner(raw: string[]): { kind: 'learn' | 'practice' | 'note'; sections: BannerSection[] } {
  const sections: BannerSection[] = []
  let current: BannerSection = { items: [] }
  let textItem: BannerItem | null = null

  const push = () => {
    if (current.items.length || current.heading) sections.push(current)
  }

  for (const t of raw) {
    if (!t.trim()) {
      textItem = null
      continue
    }
    const indented = /^\s{2,}/.test(t)
    const heading = !indented && t.match(/^([A-Z]{2,}(?: [A-Z]{2,})*)\b(?:\s+(.*))?$/)
    if (heading) {
      push()
      current = {
        heading: sentenceCase(heading[1]),
        subtitle: heading[2]?.replace(/^\(|\)$/g, '').trim() || undefined,
        items: [],
      }
      textItem = null
      continue
    }
    const marker = t.match(LIST_MARKER)
    if (marker && indented) {
      textItem = { kind: marker[2] === '-' ? 'bullet' : 'number', text: marker[3].trim() }
      current.items.push(textItem)
    } else if (indented && textItem && textItem.kind !== 'text') {
      textItem.text += ' ' + t.trim() // a wrapped continuation of the previous bullet
    } else if (ALIGNED.test(t)) {
      current.items.push({ kind: 'pre', text: t.trim() })
      textItem = null
    } else if (textItem && textItem.kind === 'text') {
      textItem.text += ' ' + t.trim()
    } else {
      textItem = { kind: 'text', text: t.trim() }
      current.items.push(textItem)
    }
  }
  push()

  const title = sections[0]?.heading ?? ''
  const kind = /learn/i.test(title) ? 'learn' : /your turn/i.test(title) ? 'practice' : 'note'
  return { kind, sections }
}

/** Index of the first line after the leading /* title comment *\/ (0 if there is none). */
export function skipModuleDocstring(lines: string[]): number {
  const first = lines.findIndex((l) => l.trim())
  if (first === -1) return 0
  // A practice file opens with "// Lesson 6: promises". That line is the page title, so it is skipped too.
  // (scripts/lib/blocks.mjs has the same rule, so both agree on where the first block starts.)
  if (/^\/\/(?!\/)\s*Lesson\s+\w+/i.test(lines[first].trim())) return first + 1
  if (lines[first].trim().startsWith('/*')) {
    let end = first
    while (end < lines.length && !lines[end].includes('*/')) end++
    return end + 1
  }
  if (!lines[first].trim().startsWith('"""')) return 0
  const t = lines[first].trim()
  let j = first
  if (!(t.length >= 6 && t.endsWith('"""'))) {
    j = first + 1
    while (j < lines.length && !lines[j].includes('"""')) j++
  }
  return j + 1
}

const ERROR_RULE = /^\/\/\/\s*@error\b/
const FILE_RULE = /^\/\/\/\s*@file\s+([^:]+):\s*(.*)$/
const INPUT_RULE = /^\/\/\/\s*@input(?:\(([^)]*)\))?:?\s*(.*)$/

interface Directive {
  /** 0-based line of the directive. */
  index: number
  input?: InputScenario
  file?: PreparedFile
}

/**
 * Reads the /// comment form through the parser's one internal form (a prose comment starts with #),
 * so every rule below works unchanged. The directives for typed input and prepared files are taken
 * out here, and each is attached to the block above it afterwards.
 */
function fromJava(source: string): { lines: string[]; directives: Directive[] } {
  const directives: Directive[] = []
  const lines = source.split('\n').map((raw, index) => {
    const line = raw.replace(/\r$/, '')
    if (!line.startsWith('///')) return line
    if (ERROR_RULE.test(line)) return '#'
    const file = line.match(FILE_RULE)
    if (file) {
      directives.push({ index, file: { name: file[1].trim(), content: file[2].split(' | ').join('\n') + '\n' } })
      return '#'
    }
    const input = line.match(INPUT_RULE)
    if (input) {
      directives.push({ index, input: { label: (input[1] ?? '').trim(), lines: input[2].split(' | ').map((s) => s.trim()) } })
      return '#'
    }
    const body = line.slice(3)
    return /^#{2,}\s*.+?\s*#{2,}$/.test(body.trim()) ? body.trim() : '#' + body
  })
  return { lines, directives }
}

export function parseLesson(source: string): LessonBlock[] {
  const { lines, directives } = fromJava(source)
  const blocks: LessonBlock[] = []
  let i = skipModuleDocstring(lines)

  let code: { idx: number; text: string }[] = []
  let inTriple = false

  const flushCode = () => {
    while (code.length && !code[code.length - 1].text.trim()) code.pop()
    while (code.length && !code[0].text.trim()) code.shift()
    if (code.length) blocks.push({ type: 'code', line: code[0].idx + 1, code: code.map((c) => c.text).join('\n') })
    code = []
  }

  while (i < lines.length) {
    const line = lines[i]

    if (inTriple) {
      code.push({ idx: i, text: line })
      if ((line.match(/"""|'''/g) ?? []).length % 2 === 1) inTriple = false
      i++
      continue
    }

    if (!line.startsWith('#')) {
      if ((line.match(/"""|'''/g) ?? []).length % 2 === 1) inTriple = true
      code.push({ idx: i, text: line })
      i++
      continue
    }

    if (BANNER_RULE.test(line)) {
      let end = i + 1
      while (end < lines.length && !BANNER_RULE.test(lines[end])) end++
      if (end < lines.length) {
        flushCode()
        const parsed = parseBanner(lines.slice(i + 1, end).map(stripHash))
        blocks.push({ type: 'banner', line: i + 1, ...parsed })
        i = end + 1
        continue
      }
    }

    const topic = line.trim().match(TOPIC_RULE)
    if (topic) {
      flushCode()
      // Headings are plain text, so `code` marks around a word would show as stray backticks.
      const label = topic[1].trim().replace(/`/g, '')
      const numbered = label.match(/^(Topic\s+\d+):\s*(.*)$/)
      blocks.push(
        numbered
          ? { type: 'topic', line: i + 1, eyebrow: numbered[1], title: numbered[2] }
          : { type: 'topic', line: i + 1, title: label },
      )
      i++
      continue
    }

    // A run of comment lines at column 0 is prose.
    flushCode()
    const start = i
    const run: string[] = [stripHash(line)] // always consume this line, so an unclosed banner rule can't stall the loop
    i++
    while (i < lines.length && lines[i].startsWith('#') && !BANNER_RULE.test(lines[i]) && !TOPIC_RULE.test(lines[i].trim())) {
      run.push(stripHash(lines[i]))
      i++
    }
    const nodes = proseNodes(run)
    if (nodes.length) blocks.push({ type: 'prose', line: start + 1, nodes })
  }
  flushCode()

  // Typed input and prepared files belong to the code block just above them.
  for (const directive of directives) {
    const owner = [...blocks].reverse().find((b) => b.type === 'code' && b.line <= directive.index + 1)
    if (!owner || owner.type !== 'code') continue
    if (directive.input) (owner.inputs ??= []).push(directive.input)
    if (directive.file) (owner.files ??= []).push(directive.file)
  }
  return blocks
}

/**
 * Every lesson with something to show gets the guided view: its code in blocks, each with its own Run and
 * captured output. (The other guides require a "What you will learn" card, because every lesson there is
 * written for the guide. Here many lessons are plain practice files with no prose at all.)
 */
export function hasGuide(blocks: LessonBlock[]): boolean {
  return blocks.some((b) => b.type === 'code')
}

/** The "what you will learn" bullets of a guided lesson (empty when it has no guide card). */
export function learnBullets(code: string): string[] {
  const card = parseLesson(code).find((b) => b.type === 'banner' && b.kind === 'learn')
  if (!card || card.type !== 'banner') return []
  return card.sections.flatMap((s) => s.items).filter((i) => i.kind === 'bullet').map((i) => i.text)
}
