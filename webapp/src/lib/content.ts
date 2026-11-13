import type { Snippet, Topic } from '@/types'

// Top-level folder name -> the track's name on the site.
const CATEGORY_LABELS: Record<string, string> = {
  'phase1-javascript': 'JavaScript',
  'phase2-react': 'React',
}

// Where a track's lessons live inside its folder, when they are not directly in it. The React lessons sit inside the
// Vite project (phase2-react/app/src/lessons/lesson1/...), and the sidebar should show only "lesson1", not the project's folders.
const LESSON_ROOTS: Record<string, string> = {
  'phase2-react': 'app/src/lessons',
}

// Lesson folder inside a track -> its section name in the sidebar. A folder with no entry here is
// named from its folder name, so a new folder still appears without touching this file.
const SECTION_LABELS: Record<string, string> = {
  lesson1: 'Lesson 1: Variables, types, control flow',
  lesson2: 'Lesson 2: Functions',
  lesson3: 'Lesson 3: Objects and arrays',
  lesson4: 'Lesson 4: Array methods',
  lesson5: 'Lesson 5: Modules',
  lesson6: 'Lesson 6: Promises',
  lesson7: 'Lesson 7: async and await',
  lesson8: 'Lesson 8: fetch and JSON',
  lesson9: 'Lesson 9: Mini project',
  // The React track has its own lesson numbers, so its sections are named by track and folder.
  'phase2-react/lesson1': 'Lesson 1: Components and JSX',
  'phase2-react/lesson2': 'Lesson 2: Props',
  'phase2-react/lesson3': 'Lesson 3: Lists',
}

// Files whose own header comment does not make a good title in the sidebar.
const TITLE_OVERRIDES: Record<string, string> = {
  'phase1-javascript/lesson5/main.js': 'main.js: importing from the other files',
  'phase1-javascript/lesson5/mathUtils.js': 'mathUtils.js: named exports',
  'phase1-javascript/lesson5/students.js': 'students.js: default and named exports',
  'phase1-javascript/lesson5/scratch.js': 'scratch.js: a wrong import, on purpose',
}

// Keyword -> extra search tags. Matched against raw source text.
const API_KEYWORD_TAGS: [RegExp, string][] = [
  [/\bconst\b|\blet\b/, 'variables const let'],
  [/`[^`]*\$\{/, 'template literal'],
  [/\bfor\s*\(/, 'for loop'],
  [/\bfor\s*\(\s*(const|let)\s+\w+\s+of\b/, 'for of loop'],
  [/\bwhile\s*\(/, 'while loop'],
  [/\bif\s*\(/, 'if else conditions'],
  [/=>/, 'arrow function'],
  [/\bfunction\b/, 'function'],
  [/\.map\(/, 'map array method'],
  [/\.filter\(/, 'filter array method'],
  [/\.find\(/, 'find array method'],
  [/\.reduce\(/, 'reduce array method'],
  [/\.sort\(/, 'sort array method'],
  [/\.(some|every)\(/, 'some every array method'],
  [/\{[^}]*\}\s*=\s*\w|\[[^\]]*\]\s*=\s*\w/, 'destructuring'],
  [/\.\.\./, 'spread rest operator'],
  [/\bimport\b|\bexport\b/, 'modules import export'],
  [/new Promise|\.then\(|\.catch\(/, 'promise then catch'],
  [/\basync\b|\bawait\b/, 'async await'],
  [/\bfetch\(/, 'fetch http request'],
  [/JSON\.(stringify|parse)|\.json\(\)/, 'json'],
  [/\btry\s*\{/, 'try catch error handling'],
  [/setTimeout|setInterval/, 'timers settimeout'],
  [/\bconsole\.(log|error)/, 'console log print'],
  [/<[A-Z]\w*[\s/>]/, 'react component jsx'],
  [/\buse(State|Effect|Ref|Memo|Callback)\b/, 'react hooks'],
]

function titleCase(words: string): string {
  return words
    .split(' ')
    .filter(Boolean)
    .map((w) => (w.length <= 3 && w === w.toLowerCase() ? w : w[0].toUpperCase() + w.slice(1)))
    .join(' ')
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function prettifySegment(segment: string): string {
  // Strip a leading numeric prefix like "4.9_" or "1_" or "4.9.6_"
  const withoutPrefix = segment.replace(/^[\d]+(\.\d+)*_/, '')
  return titleCase(withoutPrefix.replace(/[_.]/g, ' ').trim())
}

// A lesson's title is the first comment: /* Section: Title */ (as in the other guides), or, for a plain
// practice file, a first line like "// Lesson 6: promises".
function parseDocstringTitle(code: string): string | null {
  const match = code.match(/^\s*\/\*([\s\S]*?)\*\//)
  let body: string | null = null
  if (match) {
    body = match[1]
      .split('\n')
      .map((l) => l.replace(/^\s*\*\s?/, ''))
      .join(' ')
      .trim()
      .replace(/\s+/g, ' ')
  } else {
    // The "// Lesson N: title" line is the first line of a JavaScript lesson. A React lesson starts with its imports,
    // so it is looked for in the first few lines.
    const line = code
      .split('\n')
      .slice(0, 8)
      .map((l) => l.match(/^\/\/(?!\/)\s*(Lesson\s+\w+.*)$/i))
      .find(Boolean)
    if (line) body = line[1].trim()
  }
  if (!body) return null
  const colonIndex = body.indexOf(':')
  if (colonIndex !== -1) {
    const afterColon = body.slice(colonIndex + 1).trim()
    if (afterColon) return afterColon[0].toUpperCase() + afterColon.slice(1)
  }
  return body
}

function parseTopics(code: string): Topic[] {
  const lines = code.split('\n')
  const topics: Topic[] = []
  const topicPattern = /^\/\/\/\s*#{2,}\s*(.+?)\s*#{2,}$/
  lines.forEach((line, index) => {
    const match = line.trim().match(topicPattern)
    if (match) {
      topics.push({ label: match[1].trim(), line: index + 1 })
    }
  })
  return topics
}

// "4.9_Name" -> [4, 9], "lesson4" -> [4], "lesson1a.js" -> [1]
export function extractOrderKey(name: string): number[] {
  const match = name.match(/^(?:lesson)?(\d+(?:\.\d+)*)/i)
  if (!match) return []
  return match[1].split('.').map(Number)
}

export function compareOrderKey(a: number[], b: number[]): number {
  const len = Math.max(a.length, b.length)
  for (let i = 0; i < len; i++) {
    const av = a[i] ?? -1
    const bv = b[i] ?? -1
    if (av !== bv) return av - bv
  }
  return 0
}

/** Lessons with the same number (lesson1a, lesson1b) keep the order of their file names. */
export function compareLessons(a: { orderKey: number[]; filename: string; title: string }, b: { orderKey: number[]; filename: string; title: string }): number {
  return compareOrderKey(a.orderKey, b.orderKey) || a.filename.localeCompare(b.filename, undefined, { numeric: true }) || a.title.localeCompare(b.title)
}

// Globs every top-level folder in the repo (except this app, the old generator and scratch folders),
// so a brand-new track folder shows up the moment it exists, with no allowlist to remember.
const rawModules = import.meta.glob(
  [
    '../../../**/*.js',
    '../../../phase2-react/app/src/lessons/**/*.jsx',
    '!../../../webapp/**',
    '!../../../Test/**',
    '!../../../tools/**',
    '!../../../**/node_modules/**',
    // Scratch files that .gitignore keeps out of the repository
    '!../../../**/test.js',
    '!../../../**/tempCodeRunnerFile.js',
    // Tool configuration (the React lessons are served by Vite), not a lesson
    '!../../../**/vite.config.js',
  ],
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>

function buildSnippets(): Snippet[] {
  const snippets: Snippet[] = []

  for (const [modulePath, code] of Object.entries(rawModules)) {
    // modulePath looks like "../../../phase1-javascript/lesson6/lesson6.js"
    const relative = modulePath.replace(/^(\.\.\/)+/, '')
    const categoryKey = relative.split('/')[0]
    const lessonRoot = LESSON_ROOTS[categoryKey]
    const prefix = lessonRoot ? `${categoryKey}/${lessonRoot}/` : ''
    // The parts of the path inside the track, without the project folders in front of the lessons.
    const inner = prefix && relative.startsWith(prefix) ? relative.slice(prefix.length).split('/') : relative.split('/').slice(1)
    const filename = inner[inner.length - 1]
    const middleSegments = inner.slice(0, -1) // folders between category root and file

    const categoryLabel = CATEGORY_LABELS[categoryKey] ?? prettifySegment(categoryKey)
    const categorySlug = slugify(categoryKey)
    // A track other than the first has its own lesson numbers, so it only uses labels written for it.
    const sectionLabel = (s: string) => SECTION_LABELS[`${categoryKey}/${s}`] ?? (categoryKey === 'phase1-javascript' ? SECTION_LABELS[s] : undefined) ?? prettifySegment(s)
    const subSegments = middleSegments.map(sectionLabel)

    const docTitle = parseDocstringTitle(code)
    const title = TITLE_OVERRIDES[relative] ?? docTitle ?? prettifySegment(filename.replace(/\.jsx?$/, ''))
    const topics = parseTopics(code)

    const tagSet = new Set<string>()
    tagSet.add(categoryLabel.toLowerCase())
    subSegments.forEach((s) => tagSet.add(s.toLowerCase()))
    prettifySegment(filename.replace(/\.jsx?$/, ''))
      .toLowerCase()
      .split(' ')
      .forEach((w) => w.length > 2 && tagSet.add(w))
    topics.forEach((t) => tagSet.add(t.label.toLowerCase()))
    API_KEYWORD_TAGS.forEach(([pattern, tag]) => {
      if (pattern.test(code)) tagSet.add(tag)
    })

    const id = slugify([categoryKey, ...inner].join('/').replace(/\.jsx?$/, ''))

    snippets.push({
      id,
      path: relative,
      filename,
      title,
      categoryLabel,
      categorySlug,
      subSegments,
      // The lesson's number comes from its folder (lesson4) first, then its file name (lesson4b.js).
      orderKey: extractOrderKey(filename),
      tags: Array.from(tagSet),
      topics,
      code,
      lineCount: code.split('\n').length,
    })
  }

  return snippets.sort((a, b) => {
    if (a.categorySlug !== b.categorySlug) return a.categorySlug.localeCompare(b.categorySlug)
    const aSub = a.path.split('/').slice(1, -1).join('/')
    const bSub = b.path.split('/').slice(1, -1).join('/')
    if (aSub !== bSub) return aSub.localeCompare(bSub, undefined, { numeric: true })
    return compareLessons(a, b)
  })
}

export const snippets: Snippet[] = buildSnippets()

export function getSnippetById(id: string): Snippet | undefined {
  return snippets.find((s) => s.id === id)
}
