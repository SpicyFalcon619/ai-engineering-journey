// The "Bare code" view: the lesson's code with every comment removed (// and /* */ comments, the
// /// explanation lines and the `### Topic ###` markers), so only the code is left. The title comment
// at the top stays. Topics are re-pointed at their new line numbers, so the outline and jump links
// keep working.

import type { Topic } from '@/types'
import { skipModuleDocstring } from '@/lib/lesson'

interface Scanned {
  text: string
  /** True when the line opens a block comment that continues on the next line. */
  inBlock: boolean
}

// Cuts comments off one line of Java without touching `//` or `/*` inside a string or a character.
function scanLine(line: string, inBlock: boolean): Scanned {
  let out = ''
  let i = 0
  let block = inBlock
  while (i < line.length) {
    if (block) {
      const end = line.indexOf('*/', i)
      if (end === -1) return { text: out.trimEnd(), inBlock: true }
      block = false
      i = end + 2
      continue
    }
    const two = line.slice(i, i + 2)
    if (two === '//') break
    if (two === '/*') {
      block = true
      i += 2
      continue
    }
    const ch = line[i]
    if (ch === '"' || ch === "'") {
      let j = i + 1
      while (j < line.length && line[j] !== ch) j += line[j] === '\\' ? 2 : 1
      out += line.slice(i, j + 1)
      i = j + 1
      continue
    }
    out += ch
    i++
  }
  return { text: out.trimEnd(), inBlock: block }
}

export function toBareCode(code: string, topics: Topic[]): { code: string; topics: Topic[] } {
  const lines = code.split('\n')
  const topicByLine = new Map(topics.map((t) => [t.line, t]))
  const out: string[] = []
  const bareTopics: Topic[] = []
  let pending: Topic | null = null
  let inBlock = false

  const pushBlank = () => {
    if (out.length && out[out.length - 1] !== '') out.push('')
  }

  // The title comment stays: it is the one piece of text a bare lesson keeps.
  const start = skipModuleDocstring(lines)
  out.push(...lines.slice(0, start).filter((l, i) => l.trim() || i > 0))
  pushBlank()

  for (let i = start; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    if (!inBlock && !trimmed) {
      pushBlank()
      continue
    }
    if (!inBlock && trimmed.startsWith('///')) {
      const topic = topicByLine.get(i + 1)
      if (topic) {
        pending = topic
        pushBlank() // a topic marker becomes a plain gap between sections
      }
      continue
    }

    const scanned = scanLine(line, inBlock)
    inBlock = scanned.inBlock
    // A line that was only a comment disappears; it does not leave a blank behind.
    if (!scanned.text.trim()) continue
    if (pending) {
      bareTopics.push({ label: pending.label, line: out.length + 1 })
      pending = null
    }
    out.push(scanned.text)
  }

  while (out.length && out[out.length - 1] === '') out.pop()
  return { code: out.join('\n'), topics: bareTopics }
}
