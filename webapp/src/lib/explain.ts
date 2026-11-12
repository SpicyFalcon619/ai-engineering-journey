import { titleKey } from '@/lib/exercises'

// The written explanation of each question in a lesson file. It lives beside the lesson, in a file with the same
// name and ".explain.md" (lesson8/lesson8b.js -> lesson8/lesson8b.explain.md), as one "##" section per question:
//
//   ## 3. The network fails
//   Plain markdown: paragraphs, `code`, lists and fenced js examples.
//
// A section is matched to its question by title (the number does not matter), so reordering is safe.

const raw = import.meta.glob(
  [
    '../../../**/*.explain.md',
    '!../../../webapp/**',
    '!../../../**/node_modules/**',
  ],
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>

const byLesson = new Map<string, Map<string, string>>()

for (const [modulePath, text] of Object.entries(raw)) {
  // "../../../phase1-javascript/lesson8/lesson8b.explain.md" -> "phase1-javascript/lesson8/lesson8b.js"
  const lessonPath = modulePath.replace(/^(\.\.\/)+/, '').replace(/\.explain\.md$/, '.js')
  const sections = new Map<string, string>()
  let title: string | null = null
  let lines: string[] = []
  let fenced = false
  const close = () => {
    if (title !== null) sections.set(titleKey(title), lines.join('\n').trim())
  }
  for (const line of text.replace(/\r\n/g, '\n').split('\n')) {
    if (/^```/.test(line)) fenced = !fenced
    const heading = !fenced ? line.match(/^##\s+(.+?)\s*$/) : null
    if (heading) {
      close()
      title = heading[1]
      lines = []
    } else if (title !== null) {
      lines.push(line)
    }
  }
  close()
  byLesson.set(lessonPath, sections)
}

/** The written explanation of one question, or undefined when the lesson has none for it. */
export function getExplanation(lessonPath: string, questionTitle: string): string | undefined {
  const text = byLesson.get(lessonPath)?.get(titleKey(questionTitle))
  return text || undefined
}
