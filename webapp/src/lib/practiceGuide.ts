import type { LessonBlock, ProseNode } from '@/lib/lesson'
import type { BlockRun, CapturedOutput, LessonRuns, OutputSegment } from '@/lib/outputs'
import { parseExercises } from '@/lib/exercises'
import { getExplanation } from '@/lib/explain'

// A plain practice file ("// --- 2. Fetch one user ---" markers, no /// explanation) shown the way the other guides
// show a lesson: one section per question, with a real heading, the explanation as text, then the code answer and a
// button for its output. This turns the file into the same blocks a /// lesson parses into, so the Guided view draws
// it with the same components.
//
// The output of each question is not worked out here. The capture (npm run capture-outputs) recorded what every
// question printed (runs.blocks[...].parts) and the page only shows it.

const SKIPPED = /^\(?\s*skipped\s*\)?$/i

type Part = { stdout: string; segments: OutputSegment[] }

/** What each question printed, as the capture stored it. Falls back to splitting the whole run by line. */
function partsFor(runs: LessonRuns | undefined, ranges: { line: number; end: number }[], firstMarker: number): Record<string, Part> {
  const entry: BlockRun | undefined = runs ? Object.values(runs.blocks)[0] : undefined
  if (entry?.parts) return entry.parts
  const parts: Record<string, Part> = { 0: { stdout: '', segments: [] } }
  for (const r of ranges) parts[r.line] = { stdout: '', segments: [] }
  for (const segment of entry?.scenarios[0]?.segments ?? []) {
    const range = ranges.find((r) => segment[0] >= r.line && segment[0] <= r.end)
    const key = range ? String(range.line) : segment[0] > 0 && segment[0] < firstMarker ? '0' : null
    if (key === null) continue
    parts[key].segments.push(segment)
    parts[key].stdout += segment[1]
  }
  return parts
}

export function practiceToGuide(code: string, path: string, output: CapturedOutput | undefined): { blocks: LessonBlock[]; output: CapturedOutput | undefined } | null {
  const set = parseExercises(code)
  if (!set) return null

  const blocks: LessonBlock[] = []
  const runBlocks: Record<string, BlockRun> = {}
  const parts = partsFor(output?.runs, set.exercises, set.exercises[0].line)
  const addRun = (codeLine: number, key: string) => {
    const part = parts[key] ?? { stdout: '', segments: [] }
    runBlocks[String(codeLine)] = {
      status: 'ok',
      // The code is only part of a bigger file, so it cannot be run on its own.
      editable: false,
      scenarios: [{ label: '', inputs: [], stdout: part.stdout, segments: part.segments }],
    }
  }

  // Before the first question: what the file says about itself, and any shared code. It has no heading of its own:
  // it sits right under the lesson's "Your code" heading, or at the top of the page.
  if (set.intro.length > 0 || set.setupCode) {
    if (set.intro.length > 0) blocks.push({ type: 'prose', line: -2, nodes: set.intro.map((text): ProseNode => ({ type: 'p', text })) })
    if (set.setupCode) {
      blocks.push({ type: 'code', line: set.setupLine, code: set.setupCode })
      // Shared setup (a constant, the imports) usually prints nothing, so it only gets an output button when it does.
      if (parts['0']?.stdout) addRun(set.setupLine, '0')
    }
  }

  for (const q of set.exercises) {
    const base = q.line * 1000
    blocks.push({ type: 'topic', line: q.line, eyebrow: `Topic ${q.number || q.index + 1}`, title: q.title })

    const text: ProseNode[] = q.question.map((paragraph): ProseNode => ({ type: 'p', text: paragraph }))
    if (q.predict) text.push({ type: 'p', callout: 'TRY IT', text: `Predict first: ${q.predict}` })
    if (q.prediction && !SKIPPED.test(q.prediction)) text.push({ type: 'p', text: `Your prediction: ${q.prediction}` })
    if (q.answer) text.push({ type: 'p', text: `Your answer: ${q.answer}` })
    if (q.todo && !q.code) text.push({ type: 'p', callout: 'TRY IT', text: 'Not written yet. This step is for you to build.' })
    if (text.length > 0) blocks.push({ type: 'prose', line: base + 1, nodes: text })

    if (q.code) {
      blocks.push({ type: 'code', line: q.codeLine, code: q.code })
      addRun(q.codeLine, String(q.line))
    }
    if (q.actual) blocks.push({ type: 'prose', line: base + 2, nodes: [{ type: 'p', callout: 'NOTE', text: q.actual }] })

    const explanation = getExplanation(path, q.title)
    if (explanation) blocks.push({ type: 'markdown', line: base + 3, markdown: explanation })
  }

  // Output that no question owns (an error that stopped the run) goes under the last piece of code.
  const rest = parts.rest
  const lastCode = [...blocks].reverse().find((b) => b.type === 'code')
  if (rest && rest.segments.length > 0 && lastCode) {
    const run = runBlocks[String(lastCode.line)]
    run.scenarios[0].segments.push(...rest.segments)
    run.scenarios[0].stdout += rest.stdout
  }

  const runs: LessonRuns = output
    ? { capturedAt: output.runs.capturedAt, node: output.runs.node, blocks: runBlocks }
    : { capturedAt: '', node: '', blocks: {} }
  return {
    blocks,
    output: output ? { status: output.status, stdout: output.stdout, runs } : undefined,
  }
}
