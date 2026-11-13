import phase1Notes from '../../../phase1-javascript/NOTES.md?raw'
import phase2Notes from '../../../phase2-react/NOTES.md?raw'
import type { Snippet } from '@/types'
import { snippets } from '@/lib/content'

// The study notes in phase1-javascript/NOTES.md become the explanation of the guided lessons. NOTES.md stays the single
// source: this file only cuts it into lessons ("# Lesson 6: Promises") and parts ("## Part 2: ..."), and leaves out the
// bookkeeping (exercise status, review notes) that is for the author, not the reader.
//
// Which notes a lesson file shows:
//   lesson1a.js, lesson1b.js ... -> the matching "## Part" of the lesson (a is the first part, b the second, ...)
//   lesson2.js, lesson6.js ...   -> the whole lesson
//   main.js in lesson5           -> the whole lesson
//   any other file of a lesson   -> a pointer to the file that carries the notes

// The notes file of each track, by the track's folder name. Each has its own "# Lesson N: ..." sections.
const NOTE_FILES: [string, string][] = [
  ['phase1-javascript', phase1Notes],
  ['phase2-react', phase2Notes],
]

// "Part 1: Variables and types (done, 2026-11-05)" -> "Part 1: Variables and types"
const STATUS_TAIL = /\s*\((?:done|taught|in progress|not started|exercise|skipped|completed)[^)]*\)\s*$/i
// Headings that are the author's own record, not explanation.
const HIDDEN = /^(Exercise status|In my own words|Template for future lessons)$/i

interface Heading {
  index: number
  depth: number
  title: string
}

/** Every markdown heading outside code fences. */
function headingsOf(lines: string[]): Heading[] {
  const found: Heading[] = []
  let inFence = false
  lines.forEach((line, index) => {
    if (/^\s*```/.test(line)) inFence = !inFence
    if (inFence) return
    const m = line.match(/^(#{1,6})\s+(.*\S)\s*$/)
    if (m) found.push({ index, depth: m[1].length, title: m[2] })
  })
  return found
}

/** The body of a heading: its lines up to the next heading of the same or a higher level. */
function sectionEnd(headings: Heading[], at: number, total: number): number {
  const me = headings[at]
  for (let i = at + 1; i < headings.length; i++) if (headings[i].depth <= me.depth) return headings[i].index
  return total
}

/** Removes the hidden sections, strips status tails from headings, and drops headings with nothing under them. */
function tidy(markdown: string): string {
  let lines = markdown.split('\n')

  // Hidden sections, found again after every removal because the indexes move.
  for (;;) {
    const headings = headingsOf(lines)
    const at = headings.findIndex((h) => HIDDEN.test(h.title.replace(STATUS_TAIL, '')))
    if (at === -1) break
    lines = [...lines.slice(0, headings[at].index), ...lines.slice(sectionEnd(headings, at, lines.length))]
  }

  lines = lines.map((line) => (/^#{2,4}\s/.test(line) ? line.replace(STATUS_TAIL, '') : line))

  // A heading with no text and no sub-heading under it (a part that is not written yet).
  for (;;) {
    const headings = headingsOf(lines)
    const at = headings.findIndex((h, i) => {
      if (h.depth < 2) return false
      const end = sectionEnd(headings, i, lines.length)
      return lines.slice(h.index + 1, end).every((l) => !l.trim() || /^-{3,}$/.test(l.trim())) && !(headings[i + 1] && headings[i + 1].index < end)
    })
    if (at === -1) break
    lines = [...lines.slice(0, headings[at].index), ...lines.slice(sectionEnd(headings, at, lines.length))]
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').replace(/\n-{3,}\s*$/, '').trim()
}

interface LessonNotes {
  /** The whole lesson, without its own heading. */
  whole: string
  /** One entry per "## Part k" heading, each starting with that heading. */
  parts: string[]
}

const lessons = new Map<string, LessonNotes>()
const lessonKey = (track: string, lesson: number) => `${track}/${lesson}`

function build(track: string, raw: string) {
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const tops = headingsOf(lines).filter((h) => h.depth === 1)
  tops.forEach((top, i) => {
    const m = top.title.match(/^Lesson (\d+):/)
    if (!m) return
    const end = i + 1 < tops.length ? tops[i + 1].index : lines.length
    const body = tidy(lines.slice(top.index + 1, end).join('\n'))
    const bodyLines = body.split('\n')
    const partHeads = headingsOf(bodyLines).filter((h) => h.depth === 2 && /^Part \d+/i.test(h.title))
    const parts = partHeads.map((h, k) => {
      const stop = k + 1 < partHeads.length ? partHeads[k + 1].index : bodyLines.length
      return bodyLines.slice(h.index, stop).join('\n').trim()
    })
    lessons.set(lessonKey(track, Number(m[1])), { whole: body, parts })
  })
}
for (const [track, raw] of NOTE_FILES) build(track, raw)

/** Makes the anchor ids for a lesson's headings. The page and the outline both use it, in the same order, so ids match. */
export function makeSlugger() {
  const used = new Map<string, number>()
  return (text: string) => {
    const base = 'n-' + (text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section')
    const count = (used.get(base) ?? 0) + 1
    used.set(base, count)
    return count === 1 ? base : `${base}-${count}`
  }
}

export interface NoteHeading {
  label: string
  id: string
  /** 2 for a section, 3 for a sub-section. */
  depth: number
}

const plainText = (markdown: string) =>
  markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_]/g, '')
    .trim()

/** The headings of a piece of notes, for the "In this lesson" outline. */
export function noteHeadings(markdown: string): NoteHeading[] {
  const slug = makeSlugger()
  return headingsOf(markdown.split('\n'))
    .map((h) => ({ label: plainText(h.title), id: slug(plainText(h.title)), depth: h.depth }))
    .filter((h) => h.depth === 2 || h.depth === 3)
}

/** "phase1-javascript/lesson4/lesson4b.js" -> { lesson: 4, letter: 'b' } */
function identify(snippet: Snippet): { lesson: number; letter: string | null; primary: boolean } | null {
  const folder = snippet.path.match(/\/lesson(\d+)\//)
  if (!folder) return null
  const letter = snippet.filename.match(/^lesson\d+([a-z])\.jsx?$/)
  const primary = /^lesson\d+[a-z]?\.jsx?$/.test(snippet.filename) || snippet.filename === 'main.js'
  return { lesson: Number(folder[1]), letter: letter ? letter[1] : null, primary }
}

export type NotesFor = { kind: 'notes'; markdown: string } | { kind: 'pointer'; to: Snippet } | null

/** What the guided view shows as explanation for a lesson file. */
export function getNotesFor(snippet: Snippet): NotesFor {
  const who = identify(snippet)
  if (!who) return null
  const notes = lessons.get(lessonKey(snippet.categorySlug, who.lesson))
  if (!notes) return null

  if (!who.primary) {
    const home = snippets.find((s) => {
      const other = identify(s)
      return other && other.lesson === who.lesson && other.primary && s.categorySlug === snippet.categorySlug
    })
    return home ? { kind: 'pointer', to: home } : null
  }

  if (who.letter && notes.parts.length) {
    const part = notes.parts[who.letter.charCodeAt(0) - 'a'.charCodeAt(0)]
    if (part) return { kind: 'notes', markdown: part }
  }
  return notes.whole ? { kind: 'notes', markdown: notes.whole } : null
}
