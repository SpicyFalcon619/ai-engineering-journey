import { parse } from 'acorn'

// Notebook-style runs: the Sandbox keeps what earlier runs defined, like cells in a notebook. A classic script keeps
// `var` and function declarations (they become globals) but not what `const`, `let` and `class` define at the top
// level, and it refuses to declare the same name twice, which would make running the same code again fail.
//
// So before a run, the top-level `const` and `let` become `var`, and a top-level class becomes `var Name = class Name`.
// Only the first keyword of a top-level statement changes; nothing inside a function, loop or block is touched.
// The result: variables, functions and classes stay for the next run, and the same code can be run again.

interface Edit {
  at: number
  remove: number
  text: string
}

/** The code with its top-level declarations made re-runnable. Throws a SyntaxError (with a line and column) if the code does not parse. */
export function toSessionCode(source: string): string {
  let ast
  try {
    ast = parse(source, { ecmaVersion: 'latest', sourceType: 'script' })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    // A top-level await only works in a module, and a notebook-style run is a classic script.
    if (/\bawait\b/.test(message) || /\bawait\b/.test(source.split('\n')[(error as { loc?: { line: number } }).loc?.line ? (error as { loc: { line: number } }).loc.line - 1 : 0] ?? '')) {
      throw new SyntaxError(`${message}. In the Sandbox, put await inside an async function.`)
    }
    throw new SyntaxError(message)
  }

  const edits: Edit[] = []
  for (const node of ast.body) {
    if (node.type === 'VariableDeclaration' && (node.kind === 'const' || node.kind === 'let')) {
      edits.push({ at: node.start, remove: node.kind.length, text: 'var' })
    } else if (node.type === 'ClassDeclaration' && node.id) {
      edits.push({ at: node.start, remove: 0, text: `var ${node.id.name} = ` })
      edits.push({ at: node.end, remove: 0, text: ';' })
    }
  }

  // Apply from the end, so earlier positions stay valid.
  let out = source
  for (const edit of edits.sort((a, b) => b.at - a.at)) {
    out = out.slice(0, edit.at) + edit.text + out.slice(edit.at + edit.remove)
  }
  return out
}
