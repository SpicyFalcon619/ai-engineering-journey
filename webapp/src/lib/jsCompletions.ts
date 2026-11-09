import type { Completion, CompletionContext, CompletionResult, CompletionSource } from '@codemirror/autocomplete'

// Suggestions for the live editor: the words a beginner reaches for in these lessons. After a dot, the methods
// of arrays, strings, promises, Object, JSON, Math and console are offered; elsewhere, keywords and the globals.

const keyword = (label: string, detail?: string): Completion => ({ label, type: 'keyword', detail })
const fn = (label: string, detail?: string, apply?: string): Completion => ({ label, type: 'function', detail, apply })

const KEYWORDS: Completion[] = [
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'break', 'continue', 'switch', 'case', 'default',
  'try', 'catch', 'finally', 'throw', 'new', 'class', 'extends', 'import', 'export', 'from', 'async', 'await', 'typeof', 'instanceof',
  'of', 'in', 'null', 'undefined', 'true', 'false',
].map((k) => keyword(k))

const GLOBALS: Completion[] = [
  fn('console.log', 'print', 'console.log()'),
  fn('console.error', 'print an error', 'console.error()'),
  fn('setTimeout', 'run later', 'setTimeout(() => {}, 1000)'),
  fn('setInterval', 'repeat', 'setInterval(() => {}, 1000)'),
  fn('fetch', 'HTTP request', 'fetch()'),
  { label: 'Promise', type: 'class', detail: 'a value that arrives later' },
  { label: 'JSON', type: 'namespace', detail: 'text <-> objects' },
  { label: 'Math', type: 'namespace' },
  { label: 'Object', type: 'class' },
  { label: 'Array', type: 'class' },
  { label: 'Number', type: 'class' },
  { label: 'String', type: 'class' },
  { label: 'Date', type: 'class' },
  { label: 'Error', type: 'class' },
  { label: 'Map', type: 'class' },
  { label: 'Set', type: 'class' },
]

const ARRAY_METHODS = ['map', 'filter', 'find', 'findIndex', 'some', 'every', 'reduce', 'sort', 'forEach', 'includes', 'indexOf', 'slice', 'splice', 'push', 'pop', 'shift', 'unshift', 'join', 'concat', 'flat', 'at', 'reverse', 'length']
const STRING_METHODS = ['toUpperCase', 'toLowerCase', 'trim', 'split', 'includes', 'startsWith', 'endsWith', 'slice', 'replace', 'padStart', 'repeat', 'length']
const PROMISE_METHODS = ['then', 'catch', 'finally']
const OBJECT_METHODS = ['keys', 'values', 'entries', 'assign', 'freeze']

const AFTER_DOT: Completion[] = [
  ...new Set([...ARRAY_METHODS, ...STRING_METHODS, ...PROMISE_METHODS, ...OBJECT_METHODS, 'stringify', 'parse', 'json', 'message', 'status', 'ok', 'toFixed', 'resolve', 'reject', 'all']),
].map((m) => ({ label: m, type: m === 'length' || m === 'ok' || m === 'status' || m === 'message' ? 'property' : 'method' }))

export const jsCompletions: CompletionSource[] = [
  (context: CompletionContext): CompletionResult | null => {
    const dotted = context.matchBefore(/\.\w*$/)
    if (dotted) return { from: dotted.from + 1, options: AFTER_DOT, validFor: /^\w*$/ }
    const word = context.matchBefore(/\w+$/)
    if (!word || (word.from === word.to && !context.explicit)) return null
    return { from: word.from, options: [...KEYWORDS, ...GLOBALS], validFor: /^[\w.]*$/ }
  },
]
