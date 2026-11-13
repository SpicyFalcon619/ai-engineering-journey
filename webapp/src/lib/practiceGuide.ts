import type { LessonBlock, ProseNode } from '@/lib/lesson'
import { parseExercises } from '@/lib/exercises'
import { getExplanation } from '@/lib/explain'

// A plain practice file ("// --- 2. Fetch one user ---" markers, no /// explanation) taught the way the other guides
// teach a lesson: one section per question, each with a real heading, the question and its explanation as text, and
// the code for that question. After the last question comes the whole file as one block, which can be edited and run
// in the page. There is no stored output: what a program prints is seen by running it.
//
// This turns the file into the same blocks a /// lesson parses into, so the Guided view draws it with the same
// components.

const SKIPPED = /^\(?\s*skipped\s*\)?$/i

// A file that imports a neighbour (import x from "./other.js") cannot run on its own in the page.
const IMPORTS_NEIGHBOUR = /^\s*import\s[^;]*\sfrom\s+['"]\.{1,2}\//m
const IMPORTS_NEIGHBOUR_BARE = /^\s*import\s+['"]\.{1,2}\//m

export function practiceToGuide(code: string, path: string): { blocks: LessonBlock[] } | null {
  const set = parseExercises(code)
  if (!set) return null

  const blocks: LessonBlock[] = []

  // Before the first question: what the file says about itself, and any shared code. It has no heading of its own:
  // it sits right under the lesson's "Your code" heading, or at the top of the page.
  if (set.intro.length > 0) blocks.push({ type: 'prose', line: -2, nodes: set.intro.map((text): ProseNode => ({ type: 'p', text })) })
  if (set.setupCode) blocks.push({ type: 'code', line: set.setupLine, code: set.setupCode })

  for (const q of set.exercises) {
    const base = q.line * 1000
    blocks.push({ type: 'topic', line: q.line, eyebrow: `Topic ${q.number || q.index + 1}`, title: q.title })

    const text: ProseNode[] = q.question.map((paragraph): ProseNode => ({ type: 'p', text: paragraph }))
    if (q.predict) text.push({ type: 'p', callout: 'TRY IT', text: `Predict first: ${q.predict}` })
    if (q.prediction && !SKIPPED.test(q.prediction)) text.push({ type: 'p', text: `Your prediction: ${q.prediction}` })
    if (q.answer) text.push({ type: 'p', text: `Your answer: ${q.answer}` })
    if (q.todo && !q.code) text.push({ type: 'p', callout: 'TRY IT', text: 'Not written yet. This step is for you to build.' })
    if (text.length > 0) blocks.push({ type: 'prose', line: base + 1, nodes: text })

    if (q.code) blocks.push({ type: 'code', line: q.codeLine, code: q.code })
    if (q.actual) blocks.push({ type: 'prose', line: base + 2, nodes: [{ type: 'p', callout: 'NOTE', text: q.actual }] })

    const explanation = getExplanation(path, q.title)
    if (explanation) blocks.push({ type: 'markdown', line: base + 3, markdown: explanation })
  }

  // The whole file at the bottom, with its real line numbers.
  const canRun = !IMPORTS_NEIGHBOUR.test(code) && !IMPORTS_NEIGHBOUR_BARE.test(code)
  blocks.push({ type: 'topic', line: -3, title: 'The full code' })
  blocks.push({
    type: 'prose',
    line: -4,
    nodes: [
      {
        type: 'p',
        text: canRun
          ? 'All the pieces together, as one file. Press Edit and run to change it and run it yourself, in your browser.'
          : 'All the pieces together, as one file. It imports its neighbouring files, so it runs with node on your computer, not in the page.',
      },
    ],
  })
  blocks.push({ type: 'code', line: 1, code: code.replace(/\r\n/g, '\n').replace(/\n+$/, ''), full: { canRun } })

  return { blocks }
}
