// Loaded into every captured run with `node --import`. It wraps console.* so each printed line is recorded
// together with the line of the lesson that caused it (the outermost lesson frame on the call stack), and writes the record to
// the file named in TRACE_RESULT when the program ends. Output order is the order of the calls.
import { writeFileSync } from 'node:fs'
import { formatWithOptions } from 'node:util'
import { pathToFileURL } from 'node:url'

const resultFile = process.env.TRACE_RESULT
const target = process.env.TRACE_FILE
const targetUrl = target ? pathToFileURL(target).href : ''
const segments = []

// A deep call stack must not hide the outermost frame that belongs to the lesson.
Error.stackTraceLimit = 60

/**
 * The line, in the file being run, that the output belongs to (0 if none does). That is the OUTERMOST frame of the
 * lesson on the call stack: the statement that started the work. A function defined in one question and called from
 * another then counts as the second question's output, and a timer or promise callback counts as the place it was
 * written.
 */
function callerLine() {
  const frames = (new Error().stack ?? '').split('\n')
  let found = 0
  for (const frame of frames) {
    if (!(frame.includes(targetUrl) || frame.includes(target))) continue
    const match = frame.match(/:(\d+):\d+\)?\s*$/)
    if (match) found = Number(match[1])
  }
  return found
}

const streams = { log: 0, info: 0, debug: 0, dir: 0, table: 0, error: 1, warn: 1, trace: 1 }
let indent = ''
console.group = (...args) => {
  if (args.length) console.log(...args)
  indent += '  '
}
console.groupEnd = () => {
  indent = indent.slice(2)
}
for (const [name, stream] of Object.entries(streams)) {
  console[name] = (...args) => {
    const text = formatWithOptions({ colors: false }, ...args)
    segments.push([callerLine(), (indent ? text.split('\n').map((l) => indent + l).join('\n') : text) + '\n', stream])
  }
}

process.on('exit', () => {
  if (resultFile) writeFileSync(resultFile, JSON.stringify({ segments }))
})
