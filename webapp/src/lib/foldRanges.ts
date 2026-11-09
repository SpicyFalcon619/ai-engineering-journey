export interface FoldRange {
  /** 1-indexed line of the line that opens a block, e.g. "function foo() {" */
  start: number
  /** 1-indexed line of the last line inside that block */
  end: number
}

/**
 * Brace-based fold detection for JavaScript: a `{` that is closed on a later line folds everything between.
 * Braces inside strings and comments do not count. (A template literal's `${...}` is a string here, so its
 * braces are skipped with it.)
 */
export function computeFoldRanges(code: string): FoldRange[] {
  const lines = code.split('\n')
  const ranges: FoldRange[] = []
  const open: number[] = []
  let inBlockComment = false
  let inTemplate = false
  lines.forEach((raw, index) => {
    let line = ''
    let i = 0
    while (i < raw.length) {
      const two = raw.slice(i, i + 2)
      if (inBlockComment) {
        const end = raw.indexOf('*/', i)
        if (end === -1) break
        inBlockComment = false
        i = end + 2
      } else if (inTemplate) {
        // Inside a `template literal`, which may run over several lines.
        while (i < raw.length && raw[i] !== '`') i += raw[i] === '\\' ? 2 : 1
        if (i < raw.length) {
          inTemplate = false
          i++
        }
      } else if (two === '//') {
        break
      } else if (two === '/*') {
        inBlockComment = true
        i += 2
      } else if (raw[i] === '`') {
        inTemplate = true
        i++
      } else if (raw[i] === '"' || raw[i] === "'") {
        const quote = raw[i++]
        while (i < raw.length && raw[i] !== quote) i += raw[i] === '\\' ? 2 : 1
        i++
      } else {
        line += raw[i++]
      }
    }
    for (const ch of line) {
      if (ch === '{') open.push(index + 1)
      else if (ch === '}') {
        const start = open.pop()
        if (start !== undefined && index > start) ranges.push({ start, end: index })
      }
    }
  })
  return ranges
}
