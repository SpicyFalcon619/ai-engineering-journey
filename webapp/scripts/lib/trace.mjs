// Loaded into every captured run with `node --import`. It wraps console.* so each printed line is recorded
// together with the line of the lesson that printed it (read from the call stack), and writes the record to
// the file named in TRACE_RESULT when the program ends. Output order is the order of the calls.
import { writeFileSync } from 'node:fs'
import { formatWithOptions } from 'node:util'
import { pathToFileURL } from 'node:url'

const resultFile = process.env.TRACE_RESULT
const target = process.env.TRACE_FILE
const targetUrl = target ? pathToFileURL(target).href : ''
const segments = []

/** The line, in the file being run, of the nearest stack frame that belongs to it (0 if none does). */
function callerLine() {
  const frames = (new Error().stack ?? '').split('\n')
  for (const frame of frames) {
    if (!(frame.includes(targetUrl) || frame.includes(target))) continue
    const match = frame.match(/:(\d+):\d+\)?\s*$/)
    if (match) return Number(match[1])
  }
  return 0
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
