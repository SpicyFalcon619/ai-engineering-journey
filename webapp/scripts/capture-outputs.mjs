#!/usr/bin/env node
// Runs every code block of every lesson with Node and caches what each one printed, so the site can show
// real output next to the code without running anything when a page loads.
// Re-run whenever a lesson is added or edited:  npm run capture-outputs  [-- <part of a lesson path>]
//
// A lesson is a .js file. Its code blocks are the stretches of code between explanation lines (lines that
// start with /// at column 0); a plain practice file with no such lines is one block. Every block is a
// complete script that can run on its own, with two exceptions:
//   - a block that imports from a neighbouring file (import x from "./other.js") is run as the real file,
//     in its own folder, and gets no Edit button on the site (a browser cannot see the neighbour);
//   - a block followed by `/// @error` is meant to fail, to show an error message.
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, relative, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import os from 'node:os'
import { splitBlocks, splitQuestions } from './lib/blocks.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(__dirname, '..', '..')
const outputPath = join(__dirname, '..', 'src', 'lib', 'output-cache.json')
const tracePath = join(__dirname, 'lib', 'trace.mjs')
const filter = process.argv[2]

const EXCLUDED = new Set(['webapp', 'Test', 'tools', 'node_modules'])
const contentDirs = readdirSync(repoRoot, { withFileTypes: true })
  .filter((e) => e.isDirectory() && !e.name.startsWith('.') && !EXCLUDED.has(e.name))
  .map((e) => e.name)

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = join(dir, e.name)
    if (e.isDirectory()) return e.name === 'node_modules' ? [] : walk(full)
    // test.js and tempCodeRunnerFile.js are scratch files that .gitignore keeps out of the repository.
    // vite.config.js is tool configuration (a React lesson folder has one), not a lesson.
    const scratch = e.name === 'test.js' || e.name === 'tempCodeRunnerFile.js' || e.name === 'vite.config.js'
    return e.isFile() && extname(e.name) === '.js' && !scratch ? [full] : []
  })

console.log(`Using Node ${process.version}\n`)
const work = mkdtempSync(join(os.tmpdir(), 'aefg-capture-'))

// A few programs at once is plenty: most lessons wait on a timer, not on the processor.
const MAX_JOBS = 4
let active = 0
const waiting = []
const acquire = () =>
  new Promise((resolve) => {
    if (active < MAX_JOBS) {
      active++
      resolve()
    } else waiting.push(resolve)
  })
const release = () => {
  const next = waiting.shift()
  if (next) next()
  else active--
}

/** Paths in an error message would show this computer's folders: keep only the part inside the lessons. */
function clean(text) {
  const roots = [repoRoot + sep, repoRoot.split(sep).join('/') + '/', pathToFileURL(repoRoot).href + '/']
  let out = text
  for (const root of roots) out = out.split(root).join('')
  return out
    .replace(/\r\n/g, '\n')
    .replace(/^\s+at .*$/gm, '')
    .replace(/^Node\.js v.*$/gm, '')
    .replace(/\n{2,}/g, '\n')
    .trim()
}

function runNode(file, cwd, resultFile) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ['--import', pathToFileURL(tracePath).href, file], {
      cwd,
      env: { ...process.env, TRACE_RESULT: resultFile, TRACE_FILE: file, NO_COLOR: '1' },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let stderr = ''
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      child.kill('SIGKILL')
    }, 20000)
    child.stdout.on('data', () => undefined)
    child.stderr.on('data', (d) => (stderr += d))
    child.on('error', (error) => resolve({ status: -1, stderr: String(error), timedOut }))
    child.on('close', (status) => {
      clearTimeout(timer)
      resolve({ status, stderr, timedOut })
    })
  })
}

async function captureBlock(lessonFile, relPath, index, block, wholeFile) {
  await acquire()
  try {
    let file
    let cwd
    let shift
    if (block.needsNeighbours) {
      // The real file, where its neighbours are. Its line numbers are already the lesson's.
      file = lessonFile
      cwd = dirname(lessonFile)
      shift = 0
    } else {
      const dir = join(work, `${relPath.replace(/[^a-z0-9]+/gi, '_')}_${index}`)
      mkdirSync(dir, { recursive: true })
      // .mjs: the same module rules as the browser's Run, and top-level await works.
      file = join(dir, 'block.mjs')
      writeFileSync(file, block.code)
      cwd = dir
      shift = block.line - 1
    }
    const resultFile = join(work, `${relPath.replace(/[^a-z0-9]+/gi, '_')}_${index}.json`)
    const result = await runNode(file, cwd, resultFile)

    let segments = []
    if (existsSync(resultFile)) {
      try {
        segments = JSON.parse(readFileSync(resultFile, 'utf8')).segments
      } catch {
        // A killed run leaves no result.
      }
    }
    const shifted = segments.map(([line, text, stream]) => [line > 0 ? line + shift : block.line, text, stream])
    // A run that stopped with an error: its message (not the stack) goes after what it printed.
    const failed = result.status !== 0 || result.timedOut
    if (failed && !result.timedOut && result.stderr.trim()) shifted.push([block.line, clean(result.stderr) + '\n', 1])
    const stdout = shifted.map(([, text]) => text).join('')
    const status = result.timedOut ? 'timeout' : result.status === -1 ? 'launch-error' : failed ? 'runtime-error' : 'ok'
    return {
      status,
      expectError: block.expectError || undefined,
      // A block that needs its neighbours, or that is only part of a bigger file, still shows its output.
      editable: block.needsNeighbours ? false : undefined,
      scenarios: [{ label: '', inputs: [], stdout, segments: shifted, timedOut: result.timedOut || undefined }],
      wholeFile,
    }
  } finally {
    release()
  }
}

/**
 * What each question of a practice file printed, kept with the lesson so the page only has to show it. Keyed by the
 * line of the question's marker; "0" is what ran before the first question, and "rest" is anything that could not be
 * placed (a line outside every question).
 */
function partsOf(segments, questions) {
  const parts = { 0: { stdout: '', segments: [] }, rest: { stdout: '', segments: [] } }
  for (const q of questions) parts[q.line] = { stdout: '', segments: [] }
  for (const segment of segments) {
    const line = segment[0]
    const question = questions.find((q) => line >= q.line && line <= q.end)
    const key = question ? question.line : line > 0 && line < questions[0].line ? '0' : 'rest'
    parts[key].segments.push(segment)
    parts[key].stdout += segment[1]
  }
  return parts
}

const cache = {}
const counts = { ok: 0, 'runtime-error': 0, timeout: 0, 'launch-error': 0 }
const problems = []
let lessons = 0

for (const dir of contentDirs) {
  for (const file of walk(join(repoRoot, dir))) {
    const relPath = relative(repoRoot, file).split(sep).join('/')
    if (filter && !relPath.includes(filter)) continue
    const blocks = splitBlocks(readFileSync(file, 'utf8'))
    lessons++
    const results = await Promise.all(blocks.map((block, i) => captureBlock(file, relPath, i, block, blocks.length === 1)))
    const byLine = {}
    const questions = blocks.length === 1 ? splitQuestions(readFileSync(file, 'utf8')) : []
    blocks.forEach((block, i) => {
      const { wholeFile: _whole, ...entry } = results[i]
      if (questions.length) entry.parts = partsOf(entry.scenarios[0].segments, questions)
      byLine[block.line] = entry
      counts[entry.status] = (counts[entry.status] ?? 0) + 1
      if (entry.status === 'runtime-error' && !block.expectError) {
        problems.push(`${relPath}:${block.line}  stopped with an error\n${entry.scenarios[0].stdout.trim().split('\n').slice(-4).join('\n')}`)
      }
      if (block.expectError && entry.status === 'ok') problems.push(`${relPath}:${block.line}  was marked @error but ran fine`)
      if (entry.status === 'timeout') problems.push(`${relPath}:${block.line}  timed out`)
      if (entry.status === 'launch-error') problems.push(`${relPath}:${block.line}  did not run`)
    })
    cache[relPath] = { capturedAt: new Date().toISOString(), node: process.version, blocks: byLine }
    console.log(`${String(blocks.length).padStart(3)} blocks  ${relPath}`)
  }
}

// A partial run (a filter) updates only those lessons.
let existing = {}
if (filter && existsSync(outputPath)) existing = JSON.parse(readFileSync(outputPath, 'utf8'))
// Drop lessons that no longer exist, so a deleted or renamed lesson does not leave stale output behind.
for (const key of Object.keys(existing)) if (!existsSync(join(repoRoot, key))) delete existing[key]
mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, JSON.stringify({ ...existing, ...cache }, null, 1) + '\n')
rmSync(work, { recursive: true, force: true })

console.log(`\n${lessons} lessons: ${Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(', ')}`)
if (problems.length) {
  console.log('\nProblems:\n' + problems.join('\n\n'))
  process.exitCode = 1
}
