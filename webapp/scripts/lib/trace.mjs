// Loaded into every captured run with `node --import`. It wraps console.* so each printed line is recorded
// together with the lines of the lesson it came from (read from the call stack), and writes the record to the file
// named in TRACE_RESULT when the program ends. Output order is the order of the calls.
// Each piece is [innermost line, text, stream, outermost line]: the line that printed it, and the statement of the
// lesson that started the work (a call to a function defined elsewhere in the file, or the callback's own line).
import { writeFileSync } from 'node:fs'
import { formatWithOptions } from 'node:util'
import { Console } from 'node:console'
import { Writable } from 'node:stream'
import { pathToFileURL } from 'node:url'

const resultFile = process.env.TRACE_RESULT
const target = process.env.TRACE_FILE
const targetUrl = target ? pathToFileURL(target).href : ''
const segments = []

// A deep call stack must not hide the outermost frame that belongs to the lesson.
Error.stackTraceLimit = 60

/**
 * The lines, in the file being run, that the output comes from (0 if none does): `inner` is the nearest frame of the
 * lesson on the call stack (the console.log line itself), `outer` the farthest one (the statement that started the
 * work, such as `main();`). They are the same line for a console.log written straight at the top of the file.
 */
function callerLines() {
  const frames = (new Error().stack ?? '').split('\n')
  let inner = 0
  let outer = 0
  for (const frame of frames) {
    if (!(frame.includes(targetUrl) || frame.includes(target))) continue
    const match = frame.match(/:(\d+):\d+\)?\s*$/)
    if (!match) continue
    if (!inner) inner = Number(match[1])
    outer = Number(match[1])
  }
  return { inner, outer }
}

// console.table draws a table of box characters. A Console that writes into a string gives exactly Node's own table.
let tableText = ''
const tableConsole = new Console({
  stdout: new Writable({
    write(chunk, _encoding, done) {
      tableText += chunk
      done()
    },
  }),
  colorMode: false,
})
const renderTable = (...args) => {
  tableText = ''
  tableConsole.table(...args)
  return tableText.replace(/\n$/, '')
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
    const text = name === 'table' ? renderTable(...args) : formatWithOptions({ colors: false }, ...args)
    const { inner, outer } = callerLines()
    segments.push([inner, (indent ? text.split('\n').map((l) => indent + l).join('\n') : text) + '\n', stream, outer])
  }
}

process.on('exit', () => {
  if (resultFile) writeFileSync(resultFile, JSON.stringify({ segments }))
})
