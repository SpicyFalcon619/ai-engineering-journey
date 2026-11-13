import rawCache from './output-cache.json'

// The site never runs a lesson to show its output: `npm run capture-outputs` runs every code block of every
// lesson with Node and stores what each one printed (src/lib/output-cache.json).

export type BlockStatus = 'ok' | 'runtime-error' | 'timeout' | 'launch-error'

/**
 * [lesson line that printed it, text, stream, lesson line that started the work]: stream 0 is normal output, 1 is the
 * error stream. The last number is the statement that caused the output (a call such as `main();`); it is the same line
 * as the first for a console.log written straight in the file, and is missing in output captured before it existed.
 */
export type OutputSegment = [number, string, number, number?]

/** One run of a block. */
export interface Scenario {
  label: string
  inputs: string[]
  stdout: string
  segments: OutputSegment[]
  timedOut?: boolean
  launchError?: string
}

export interface BlockRun {
  status: BlockStatus
  /** The lesson shows this block failing on purpose, to explain the error. */
  expectError?: boolean
  /** False for a block that needs the files beside it (an import): it shows its output but has no Edit button. */
  editable?: boolean
  scenarios: Scenario[]
}

export interface LessonRuns {
  capturedAt: string
  /** The Node version that ran the lesson. */
  node: string
  /** Keyed by the line the code block starts on. */
  blocks: Record<string, BlockRun>
}

const cache = rawCache as unknown as Record<string, LessonRuns>

export function getRuns(path: string): LessonRuns | undefined {
  return cache[path]
}

/** True when a block has something to show: it ran and printed, or it failed on purpose. */
export function blockHasResult(run: BlockRun | undefined): run is BlockRun {
  if (!run) return false
  return run.scenarios.some((s) => s.stdout.trim() !== '')
}

// -------------------------------------------------------------------------------------------------
// A single lesson-level view, for the few places that show one preview of a lesson (the home page's
// peek, the capture dialog's "include the output").
// -------------------------------------------------------------------------------------------------

export interface CapturedOutput {
  status: 'ok' | 'empty'
  stdout: string
  runs: LessonRuns
}

/** The output of a whole lesson read as one: every block's first run, in order. */
export function getOutput(path: string): CapturedOutput | undefined {
  const runs = getRuns(path)
  if (!runs) return undefined
  const stdout = Object.entries(runs.blocks)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([, block]) => block.scenarios[0]?.stdout.trim() ?? '')
    .filter(Boolean)
    .join('\n\n')
  return { status: stdout ? 'ok' : 'empty', stdout, runs }
}

/**
 * What the chosen lines printed: every piece of output whose line is chosen, or whose starting statement is chosen
 * (so picking a call such as `main();` gives what the call printed, and picking a console.log line gives that line's
 * output). Pieces keep the order they were printed in. Returns null when the capture has no line information, so the
 * caller can fall back to whole blocks.
 */
export function outputForSelection(runs: LessonRuns | undefined, chosen: Set<number>): string | null {
  if (!runs) return null
  const pieces: string[] = []
  let known = false
  for (const block of Object.values(runs.blocks)) {
    const segments = block.scenarios[0]?.segments
    if (!segments || segments.length === 0) continue
    known = true
    for (const [line, text, , outer] of segments) {
      if (chosen.has(line) || (outer !== undefined && chosen.has(outer))) pieces.push(text)
    }
  }
  return known ? pieces.join('').trim() : null
}

/** What the blocks overlapping the given lines printed (each block's first run), or '' for none. */
export function outputForLines(runs: LessonRuns | undefined, blockLines: { line: number; end: number }[], chosen: Set<number>): string {
  if (!runs) return ''
  return blockLines
    .filter((block) => [...chosen].some((n) => n >= block.line && n <= block.end))
    .map((block) => runs.blocks[String(block.line)]?.scenarios[0]?.stdout.trim() ?? '')
    .filter(Boolean)
    .join('\n\n')
}
