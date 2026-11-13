// The page inside the sandboxed frame that shows a React lesson. It is built into public/react-runner.js (see
// vite.runner.config.ts, `npm run build:react-runner`) so the frame needs nothing from the internet: React, the
// JSX translator and this code all travel in that one file.
//
// The page asks it to show some code:   { type: 'run', code }
// It answers:  { type: 'ready' }  { type: 'rendered' }  { type: 'error', message }  { type: 'height', value }
//
// The code is a lesson file: JSX, `import { useState } from 'react'`, and `export default function Lesson() { ... }`.
// The default export is drawn as the page. The frame is sandboxed (scripts only, no same-origin), so the code cannot
// reach the site's storage or cookies.
import * as React from 'react'
import * as jsxRuntime from 'react/jsx-runtime'
import { createRoot, type Root } from 'react-dom/client'
import { transform } from 'sucrase'

const modules: Record<string, unknown> = {
  react: React,
  'react/jsx-runtime': jsxRuntime,
}

const send = (message: Record<string, unknown>) => parent.postMessage(message, '*')
// The height of the content itself (not the frame's own height, which would never get smaller).
const sendHeight = () => send({ type: 'height', value: Math.ceil(document.body.getBoundingClientRect().height) })
const mount = document.getElementById('root') as HTMLElement
let root: Root | null = null
let version = 0

// Turns the lesson's text into the component it exports.
function load(source: string): React.ComponentType {
  let code: string
  try {
    code = transform(source, { transforms: ['jsx', 'imports'], jsxRuntime: 'automatic', production: true, filePath: 'lesson.jsx' }).code
  } catch (error) {
    const message = error instanceof Error ? error.message.replace(/^Error transforming lesson\.jsx: /, '') : String(error)
    throw new Error(
      `${message}

Things to check: two elements side by side with no single parent (wrap them in a <div> or <>...</>), a tag that is not closed, or a missing } or ).`,
    )
  }
  const exports: Record<string, unknown> = {}
  const require = (name: string) => {
    if (name in modules) return modules[name]
    throw new Error(`Cannot import "${name}" here. Only "react" is available in this preview.`)
  }
  new Function('exports', 'require', code)(exports, require)
  const component = exports.default
  if (typeof component !== 'function') throw new Error('The file needs `export default` on the component to show, for example: export default function Lesson() { ... }')
  return component as React.ComponentType
}

// An error while drawing the component is shown in the frame instead of leaving it blank.
class Boundary extends React.Component<{ children?: React.ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  componentDidCatch(error: Error) {
    send({ type: 'error', message: error.message })
  }
  render() {
    return this.state.error ? React.createElement('pre', { style: { color: '#b00020', whiteSpace: 'pre-wrap' } }, this.state.error.message) : this.props.children
  }
}

function run(source: string) {
  try {
    const Component = load(source)
    root ??= createRoot(mount)
    version += 1
    root.render(React.createElement(Boundary, { key: version }, React.createElement(Component)))
    send({ type: 'rendered' })
    // A frame scrolled out of view may not report size changes, so the height is also sent a moment after drawing.
    setTimeout(sendHeight, 80)
    setTimeout(sendHeight, 400)
  } catch (error) {
    send({ type: 'error', message: error instanceof Error ? error.message : String(error) })
  }
}

addEventListener('message', (event) => {
  if (event.source !== parent) return
  const data = event.data as { type?: string; code?: string }
  if (data?.type === 'run') run(String(data.code ?? ''))
})
addEventListener('error', (event) => send({ type: 'error', message: event.message }))
addEventListener('unhandledrejection', (event) => send({ type: 'error', message: String((event.reason as Error)?.message ?? event.reason) }))

// So the page can size the frame to what is drawn in it.
new ResizeObserver(sendHeight).observe(document.body)
send({ type: 'ready' })
