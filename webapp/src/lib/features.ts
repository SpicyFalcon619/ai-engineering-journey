// Shows a plain practice file in the Guided view as one section per question (heading, explanation, code and its
// own output), built from the `// --- N. Title ---` markers and the lesson's .explain.md file. Off by default: the
// Guided view shows the whole file as one block with the output of the whole run, as it did before.
//
// To use it, set this to true, and run the capture with PARTS=1 so each question's output is stored:
//   PARTS=1 npm run capture-outputs
export const PRACTICE_VIEW = false
