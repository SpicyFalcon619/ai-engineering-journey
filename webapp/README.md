# AI Engineering Field Guide: the web app

Vite + React + TypeScript + Tailwind v4. A static site: no server, no database. Progress, saved lessons and settings live in the visitor's own browser.

Live at: https://spicyfalcon619.github.io/ai-engineering-journey/

This is the same app as the [ML Field Guide](https://spicyfalcon619.github.io/ml-research-journey/) and the [Java Field Guide](https://spicyfalcon619.github.io/java-field-guide/), adapted for JavaScript. The three sites link to each other from the top bar (`src/lib/guides.ts` is the one list they read).

## Running locally

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build into dist/
npm run lint
```

`npm run capture-outputs` needs Node.js (any recent version; 22 or newer).

## Where lessons live

Every top-level folder of the repository (except `webapp`, `Test` and `tools`) is a **track**, drawn as one line on the home map. Inside it, every `.js` file is a lesson. Sub-folders become sections in the sidebar, so `phase1-javascript/lesson6/lesson6.js` is the lesson "Promises" inside the section "Lesson 6: Promises" of the track "JavaScript".

- **Title.** A lesson's title is its first comment: `/* Section: Title */`, or, for a plain practice file, a first line like `// Lesson 6: promises`. The text after the first colon is the page title.
- **Order.** The number in a folder or file name sets the order (`lesson4`, `lesson4a.js`, `lesson4b.js`). Section names for the lesson folders are listed in `src/lib/content.ts` (`SECTION_LABELS`); a folder with no entry is named from its folder name.
- **The roadmap.** `ROADMAP.md` in the repository root lists the six basecamps as a checklist; the site reads it for its Roadmap and Progress views. `src/lib/roadmap.ts` maps each basecamp to the track folders that belong to it: add a folder there when a new basecamp gets lessons, and write its blurb in `src/lib/categoryInfo.ts` and `src/lib/journey.ts`.

## The React lessons

`phase2-react/` is a Vite + React project (`phase2-react/app`). Its lesson files are the `.jsx` files in `phase2-react/app/src/lessons/lessonN/`, and the site shows only those (not `App.jsx`, `main.jsx` or the project's config). They appear as the **React** track, with the notes from `phase2-react/NOTES.md` (same `# Lesson N: ...` and `## Part k` layout as the JavaScript notes) above the code. `src/lib/content.ts` (`LESSON_ROOTS`, `SECTION_LABELS`) says where the lessons sit and what each section is called; give a new lesson folder a label there.

React code runs in the learner's own Vite project, not in the page, so these lessons show the code (highlighted as JSX) and have no run button, and the notes' `jsx` examples can be copied but not run. A "// Lesson N: title" line within the first few lines of the file is its title.

## The study notes

`phase1-javascript/NOTES.md` is the explanation of the lessons. The guided view reads it directly (`src/lib/notes.ts`), so there is one source and nothing to copy:

- Each `# Lesson N: ...` section of the notes is shown above the code of the lesson files in `lessonN/`. Files named `lesson1a.js`, `lesson1b.js` show the matching `## Part` of the lesson (a is the first part, b the second); other files of a lesson point to the one that carries the notes (`lessonN.js`, or `main.js` in lesson 5).
- Headings called "Exercise status" and "In my own words", and status tails such as "(done, 2026-11-05)", are the author's own record and are left out of the page.
- The "In this lesson" panel lists the notes' headings, and every JavaScript example has **Copy** and **Try it in the Sandbox** buttons.
- After the notes comes the heading "Your code": the lesson file itself, with its real output and an **Edit** button.

Edit `NOTES.md`, commit, and the site shows the change at the next deploy. Nothing needs capturing for the notes (only for the code's output).

## Practice files, one question at a time

A plain practice file (no `///` explanation) is taught in the Guided view the way the other guides teach a lesson: one section per question, each with a numbered heading, the question and the explanation as text, and the code for that question. After the last question comes **the full code** as one block, which can be edited and run in the page (**Edit and run**, a live run in the reader's browser). There is no stored sample output in this view: what a program prints is seen by running it. A file that imports its neighbours (`import x from "./other.js"`) cannot run in the page, so its full code has no run button.

The view is switched by `PRACTICE_VIEW` in `src/lib/features.ts`. Set it to `false` to show a plain file as one block with the stored output of the whole run instead. A question is marked by a comment line of dashes:

```js
// --- 3. The network fails ---
// In a try/catch, fetch a domain that does not exist and print error.name.   <- the question
// Predict first: does this reach catch?                                       <- shown as "Predict first"
// My prediction: yes                                                          <- shown as "Your prediction"
// Actual: it prints TypeError fetch failed.                                   <- shown as "What happened"
async function testNetworkFailure() { ... }                                    <- the code, up to the next marker
```

- The title can start with a number (`1. `) or `Step 1: `, or have neither. `// ===== Title =====` works as a marker too.
- The comment lines right below a marker are the question. Lines starting `Question:`, `Predict first:` / `Predict:`, `My prediction:` / `Prediction:`, `My answer:`, `Actual:` / `Result:` become labelled rows; anything else in that run is the question text. A bare `// TODO` marks a question that is not written yet.
- Everything before the first marker is shown at the top, with no heading of its own: the header comments and any shared code (a constant, the imports).
- **Output.** This view shows no stored output. The capture (`npm run capture-outputs`) still records, for every printed piece, the line that printed it and the statement that started the work (`[line, text, stream, starting line]` in `output-cache.json`), which the Capture dialog uses to show only the output of the selected lines.
- **Written explanations.** Put a file beside the lesson with the same name and `.explain.md` (`lesson8/lesson8b.explain.md`) and give each question a `##` section with the same title (the number does not matter). It is shown under the code and its output as ordinary text. It is plain markdown, with the same glossary underlines and code blocks as the study notes. For a question that is not written yet it works as a hint.

A file needs at least two markers to get this view; the Full code and Bare code tabs are unchanged.

## Writing a lesson

A plain practice file needs nothing special: the whole file is one block, shown with the output it printed. To write a **guided** lesson, with explanation between blocks, use the same conventions as the Java guide, which work in JavaScript because `///` is an ordinary comment:

- **Explanation** is any line that starts with `///` (three slashes) at column 0. Ordinary `//` comments are code, wherever they sit, so an example keeps its own comments.
- **A code block** is everything between explanation lines. It must be a complete script that can run on its own, so a reader can copy it and run it as it is.
- `/// ### Topic 1: Title ###` starts a numbered section.
- A card is fenced by `/// ====...` lines. One whose first line is `WHAT YOU WILL LEARN` (bullets as `///   - item`) or `YOUR TURN` (numbered `///   1. item`) gets that card style.
- In prose: `- item` and `1. item` lines (indented three spaces) make lists; lines with a run of spaces in them (aligned columns, diagrams) stay preformatted; `/// --- Title -----` is a sub-heading; `` `backticks` `` and `name(...)` calls are shown as code.
- **A block that is meant to fail.** `/// @error` right after a block says it is a deliberate mistake. The capture then expects it to fail, shows the real message, and reports it if it unexpectedly runs fine. (`lesson5/scratch.js` does this.)
- **Notes.** A paragraph that starts with `NOTE:`, `TIP:`, `WARNING:`, `IMPORTANT:`, `WHY:`, `MISTAKE:`, `ANALOGY:`, `JARGON:`, `REMEMBER:` or `TRY IT:` becomes a coloured callout.
- **Glossary.** Terms live in `src/lib/glossary.ts`. The first time a lesson's explanation uses one, it gets a dotted underline and a popover.

**Blocks that import neighbours.** A block that imports from a neighbouring file (`import x from "./other.js"`) is captured by running the real file in its own folder, and its Edit button is hidden, because a browser cannot see the neighbour. (`lesson5/main.js` is one.)

## After adding or editing a lesson: capture its output

The capture records, for every printed piece, the line of the lesson that printed it and the statement that started the work (`[line, text, stream, starting line]` in `output-cache.json`). The Capture dialog uses this: with lines selected, "Include the output" shows only what those lines printed, or what a selected call printed (select a `console.log` line, or a call such as `printReport(report)`). A call that is not awaited at the top level, such as a bare `main();`, loses its starting line, so select the lines inside the function instead (or write `await main();`).

The site never runs a lesson to show its output. Every sample output comes from `src/lib/output-cache.json`, which is **not** regenerated automatically:

```bash
npm run capture-outputs                 # every lesson
npm run capture-outputs -- lesson6      # only paths containing this text
```

Each block is run with Node (`scripts/capture-outputs.mjs`), through a small preload (`scripts/lib/trace.mjs`) that records which line printed what. Commit the updated JSON with the lesson. Lesson 8 and the sandbox's `fetch` example call a real public API (jsonplaceholder.typicode.com), so capturing them needs an internet connection.

## The live runner

Press **Edit** on a block (or open the Sandbox) and the code runs in the reader's own browser, in a hidden frame with `sandbox="allow-scripts"` and no `allow-same-origin`, so it cannot read this site's storage. `src/lib/jsRunner.ts` replaces `console`, watches timers and `fetch`, and decides the program has finished when nothing is left to wait for (or after twenty seconds). There is no keyboard input and no file access. The editor is CodeMirror with a small completion list in `src/lib/jsCompletions.ts`.

## Storage keys

The three guides share one address, so they share browser storage. A reader's look (theme, background, code size, capture style) uses the same keys in all three, so it carries across. Everything about the lessons (done, saved, recent, chats) uses this site's own `aefg-` prefix, so progress never mixes between guides. See `src/lib/userData.ts`.

## Things not to do

- Do not put a `/// @error` directive inside a block; it belongs on the line after the block.
- Do not run an auto-formatter over a lesson that has `///` explanation: it rewrites the comments and spacing the explanations point at.
- Do not use decorative emoji anywhere on the site.
