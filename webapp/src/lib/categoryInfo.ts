// Plain-language description of each track, shown on the home page and at the top
// of the track page. Keyed by the category slug (the folder name, slugified).
// A track with no entry here simply shows without a description, so a brand-new
// folder still appears in the guide without touching this file.
export const CATEGORY_INFO: Record<string, string> = {
  'phase2-react':
    'React from the ground up, in a Vite project of my own: components and JSX first, then props, state, events, lists, effects and forms. React code runs in the browser through Vite, so these lessons show the code and the notes, not a run button.',
  'phase1-javascript':
    'JavaScript from the ground up: variables and control flow, functions, objects and arrays, array methods, modules, promises, async and await, and fetch with JSON. One folder per lesson, each file with the real output it printed.',
}
