// Cuts a plain practice file into its questions. The lesson files mark each one with a comment line:
//
//   // --- 2. Fetch one user ---          (a number is optional: "// --- Variables ---" works too)
//   // async function: fetch the user and print the name.     <- the question: the comment lines right below
//   // Predict first: what does it print?                      <- a labelled line: Predict / My prediction / Actual
//   // My prediction: a promise
//   async function fetchOneUser() { ... }                      <- the code, up to the next marker
//
// The file stays the single source of truth. Nothing here changes the code: this only reads it, so the Guided view
// can show one question at a time instead of the whole file at once.

export interface Exercise {
  /** 0-based position in the file. */
  index: number
  /** The number in the title ("1" for "1. Print 1 to 5" or "Step 1: ..."), or '' when there is none. */
  number: string
  title: string
  /** The line of the marker, and the last line that belongs to this question. */
  line: number
  end: number
  /** The question, as paragraphs. */
  question: string[]
  predict?: string
  prediction?: string
  /** The reader's own answer to a written question ("Question: ... My answer: ..."). */
  answer?: string
  actual?: string
  code: string
  /** The line the code starts on (1-based), so its line numbers match the file. */
  codeLine: number
  /** Only a placeholder is written so far. */
  todo: boolean
}

export interface ExerciseSet {
  /** The text at the top of the file, as paragraphs (the title line is left out). */
  intro: string[]
  /** Code before the first question (a shared constant, the imports). */
  setupCode: string
  setupLine: number
  exercises: Exercise[]
}

const MARKER = /^\/\/\s*(?:-{3,}|={3,})\s*(.+?)\s*(?:-{3,}|={3,})\s*$/
const NUMBERED = /^(?:Step\s+)?(\d+)\s*[.:)]\s*(.*)$/i
const LABEL = /^(Predict first|Predict|My prediction|Prediction|My answer|Answer|Question|Actual|Result|Why|Explain|Hint)\s*:\s*(.*)$/i
const TITLE_LINE = /^\/\/\s*Lesson\s+\w+/i

const stripSlashes = (line: string) => line.replace(/^\/\/\s?/, '').trimEnd()
const isComment = (line: string) => line.trimStart().startsWith('//')

/** The words of a title with its number taken off, in lower case: how a written explanation is matched to a question. */
export function titleKey(title: string): string {
  const match = title.trim().match(NUMBERED)
  return (match ? match[2] : title).trim().toLowerCase()
}

/** Comment lines as paragraphs: a blank comment line starts a new one. */
function paragraphs(lines: string[]): string[] {
  const out: string[] = []
  let current: string[] = []
  const flush = () => {
    if (current.length) out.push(current.join(' '))
    current = []
  }
  for (const line of lines) {
    if (!line.trim()) flush()
    else current.push(line.trim())
  }
  flush()
  return out
}

function trimBlank(lines: string[]): string[] {
  let start = 0
  let end = lines.length
  while (start < end && !lines[start].trim()) start++
  while (end > start && !lines[end - 1].trim()) end--
  return lines.slice(start, end)
}

export function parseExercises(source: string): ExerciseSet | null {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const markers: number[] = []
  lines.forEach((line, i) => {
    if (MARKER.test(line.trim())) markers.push(i)
  })
  if (markers.length < 2) return null

  // ---- Before the first question ----
  const introText: string[] = []
  const setup: { text: string; idx: number }[] = []
  let first = true
  for (let i = 0; i < markers[0]; i++) {
    const line = lines[i]
    if (first && line.trim()) {
      first = false
      if (TITLE_LINE.test(line.trim())) continue
    }
    if (isComment(line)) introText.push(stripSlashes(line.trimStart()))
    else setup.push({ text: line, idx: i })
  }
  const setupTrimmed = trimBlank(setup.map((s) => s.text))
  const setupFirst = setup.findIndex((s) => s.text.trim())

  // ---- Each question ----
  const exercises: Exercise[] = markers.map((start, index) => {
    const nextStart = markers[index + 1] ?? lines.length
    const markerText = lines[start].trim().match(MARKER)![1]
    const numbered = markerText.match(NUMBERED)
    const body = lines.slice(start + 1, nextStart)

    // The comment lines right below the marker are the question; the code starts at the first other line.
    let cut = 0
    while (cut < body.length && isComment(body[cut])) cut++
    const commentLines = body.slice(0, cut).map((l) => stripSlashes(l.trimStart()))
    const codeLines = body.slice(cut)
    const code = trimBlank(codeLines).join('\n')
    const leadingBlanks = codeLines.findIndex((l) => l.trim())

    const question: string[] = []
    const labelled: Record<string, string[]> = {}
    let current: string[] | null = null
    const loose: string[] = []
    for (const line of commentLines) {
      // A bare TODO is a placeholder, not part of the question.
      if (line.trim().toUpperCase() === 'TODO') continue
      const label = line.match(LABEL)
      if (label) {
        const key = label[1]
          .toLowerCase()
          .replace('predict first', 'predict')
          .replace(/^prediction$/, 'my prediction')
          .replace(/^answer$/, 'my answer')
        current = labelled[key] ?? (labelled[key] = [])
        current.push(label[2])
      } else if (current && line.trim()) {
        current.push(line.trim())
      } else if (!line.trim()) {
        current = null
        loose.push('')
      } else {
        loose.push(line)
      }
    }
    question.push(...paragraphs([...(labelled['question'] ?? []), '', ...loose]).filter((p) => p.toUpperCase() !== 'TODO'))
    const joined = (key: string) => {
      const value = labelled[key]?.join(' ').trim()
      return value === undefined ? undefined : value
    }
    const todo = commentLines.some((l) => l.trim().toUpperCase() === 'TODO') && !code
    // Keep the labelled lines out of the question; "Why" and "Explain" read as the explanation of the answer.
    const actual = [joined('actual') ?? joined('result'), joined('why') ?? joined('explain')].filter(Boolean).join(' ') || undefined

    return {
      index,
      number: numbered ? numbered[1] : '',
      title: numbered ? numbered[2] : markerText,
      line: start + 1,
      end: nextStart, // the last line of this question (1-based), just before the next marker
      question,
      predict: joined('predict'),
      prediction: joined('my prediction'),
      answer: joined('my answer'),
      actual,
      code,
      codeLine: start + 1 + 1 + cut + Math.max(leadingBlanks, 0),
      todo,
    }
  })

  return {
    intro: paragraphs(introText),
    setupCode: setupTrimmed.join('\n'),
    setupLine: setupFirst >= 0 ? setup[setupFirst].idx + 1 : 1,
    exercises,
  }
}
