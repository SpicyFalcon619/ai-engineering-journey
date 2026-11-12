// Splits a lesson file into its code blocks, the same way the site's Guided view does:
// lines starting with /// (three slashes, at column 0) are explanation, and the code between them is a
// block. Ordinary // comments are always code, wherever they sit.
// Every block is a complete script: it can run on its own. This file has to agree with src/lib/lesson.ts
// about where blocks start, because the captured output is looked up by the block's first line.
//
// Directives, each on a /// line right after the block it belongs to:
//   /// @error     this block is MEANT to fail (to show an error message)
//   /// @input a | b   lines typed for the block's prompts, one scenario per @input line (reserved)

const ERROR_DIRECTIVE = /^\/\/\/\s*@error\b/
const INPUT_DIRECTIVE = /^\/\/\/\s*@input(?:\(([^)]*)\))?:?\s*(.*)$/
const FILE_DIRECTIVE = /^\/\/\/\s*@file\s+([^:]+):\s*(.*)$/

/** The title at the top of a lesson: a block comment, or a "// Lesson N: ..." line. Returns the line after it. */
export function skipTitleComment(lines) {
  const first = lines.findIndex((l) => l.trim())
  if (first === -1) return 0
  const text = lines[first].trim()
  if (/^\/\/(?!\/)\s*Lesson\s+\w+/i.test(text)) return first + 1
  if (!text.startsWith('/*')) return 0
  let j = first
  while (j < lines.length && !lines[j].includes('*/')) j++
  return j + 1
}

/**
 * A block that imports from a neighbouring file (import x from "./other.js") can only run next to that file.
 * It is captured from the real folder, but the browser's Run is switched off for it.
 */
export function needsNeighbours(code) {
  return /^\s*import\s[^;]*\sfrom\s+['"]\.{1,2}\//m.test(code) || /^\s*import\s+['"]\.{1,2}\//m.test(code)
}

export function splitBlocks(source) {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let code = []
  const flush = () => {
    while (code.length && !code[code.length - 1].text.trim()) code.pop()
    while (code.length && !code[0].text.trim()) code.shift()
    if (code.length) {
      const text = code.map((c) => c.text).join('\n')
      blocks.push({ line: code[0].idx + 1, code: text, inputs: [], files: [], expectError: false, needsNeighbours: needsNeighbours(text) })
    }
    code = []
  }
  for (let i = skipTitleComment(lines); i < lines.length; i++) {
    const line = lines[i]
    if (!line.startsWith('///')) {
      code.push({ idx: i, text: line })
      continue
    }
    if (ERROR_DIRECTIVE.test(line)) {
      flush()
      const lastBlock = blocks[blocks.length - 1]
      if (lastBlock) lastBlock.expectError = true
      continue
    }
    const fileDirective = line.match(FILE_DIRECTIVE)
    if (fileDirective) {
      flush()
      const lastBlock = blocks[blocks.length - 1]
      if (lastBlock) lastBlock.files.push({ name: fileDirective[1].trim(), content: fileDirective[2].split(' | ').join('\n') + '\n' })
      continue
    }
    const directive = line.match(INPUT_DIRECTIVE)
    if (directive && blocks.length + (code.length ? 1 : 0) > 0) {
      // The directive belongs to the block just above it, so close that block first.
      flush()
      const lastBlock = blocks[blocks.length - 1]
      if (lastBlock) lastBlock.inputs.push({ label: (directive[1] ?? '').trim(), lines: directive[2].split(' | ').map((s) => s.trim()) })
      continue
    }
    flush()
  }
  flush()
  return blocks
}

// A plain practice file marks its questions with a comment line such as `// --- 2. Fetch one user ---` (or `// ===== X =====`).
// This must agree with parseExercises in src/lib/exercises.ts about where a question starts. Each question runs from its
// marker to the line before the next one. The capture stores what each printed, so the page never works it out itself.
const QUESTION_MARKER = /^\/\/\s*(?:-{3,}|={3,})\s*(.+?)\s*(?:-{3,}|={3,})\s*$/

/** [{ line, end }] (1-based, inclusive), or [] when the file has fewer than two markers. */
export function splitQuestions(source) {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const starts = []
  lines.forEach((text, i) => {
    if (QUESTION_MARKER.test(text.trim())) starts.push(i + 1)
  })
  if (starts.length < 2) return []
  return starts.map((line, i) => ({ line, end: i + 1 < starts.length ? starts[i + 1] - 1 : lines.length }))
}
