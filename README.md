# AI Engineering Journey

My path from JavaScript to building a complete AI-powered app: a React frontend, a Python (FastAPI) backend, and a machine learning model behind it. Everything is written for a beginner and followed in order, with real code and the real output it printed.

**[Read it as a site: the AI Engineering Field Guide](https://spicyfalcon619.github.io/ai-engineering-journey/)**

It is one of three guides built on the same app. The others are the [ML Field Guide](https://spicyfalcon619.github.io/ml-research-journey/) (Python to deep learning) and the [Java Field Guide](https://spicyfalcon619.github.io/java-field-guide/) (object oriented programming). They link to each other from the top bar.

## The goal

One app, end to end:

```
React frontend  ->  fetch()  ->  FastAPI backend  ->  trained model  ->  prediction  ->  back to the page
```

Each stage is learned only after the one before it makes sense, and each ends with something small that works.

## The roadmap

| Basecamp | What it covers | Status |
|---|---|---|
| 1. JavaScript fundamentals | Variables, functions, objects, array methods, modules, promises, `async`/`await`, `fetch` and JSON | In progress (lesson 9 of 9, the mini project) |
| 2. React fundamentals | Vite, JSX, components, props, state, effects, forms; a task manager and a public-API app | Not started |
| 3. Backend with Python and FastAPI | HTTP and REST, GET and POST endpoints, Pydantic validation, errors, CORS, testing | Not started |
| 4. React and FastAPI together | `fetch` from React to FastAPI, loading and error states, environment variables | Not started |
| 5. Machine learning integration | Saving a scikit-learn model, serving predictions, showing them in React | Not started |
| 6. Modern AI applications | LLM APIs, embeddings and RAG, authentication, a database, deployment, basic security | Not started |

The checklist behind this table is [ROADMAP.md](ROADMAP.md); the site reads it for its progress view. [LEARNING_PROGRESS.md](LEARNING_PROGRESS.md) is the running record of what is done, what is hard, and what comes next.

## What the site gives you

- **A rail map.** Every track is a coloured line and every lesson a stop, so you always see where you are.
- **Code beside its real output.** Each lesson file was actually run; the output on the page is what it printed, not a guess.
- **Edit and run in the page.** Any block can be changed and run in your browser, inside a sandboxed frame. The Sandbox page keeps variables between runs, like a notebook.
- **Study notes.** [phase1-javascript/NOTES.md](phase1-javascript/NOTES.md) is shown above each lesson's code, with an outline and a "Try it in the Sandbox" button on every example.
- **A glossary.** Words such as *promise* and *callback* are underlined where they first appear; hover or tap for the meaning.
- **Search** (`Ctrl+K`), **progress** you can tick off, and several themes. Progress stays in your own browser; nothing is sent anywhere.

## What's in the repo

```
phase1-javascript/
  NOTES.md        the study reference for every lesson
  lesson1/ ...    one folder per lesson, with its exercise files
webapp/           the website, and the script that captures each lesson's output
ROADMAP.md        the six basecamps as a checklist
LEARNING_PROGRESS.md
```

The lessons so far:

| Lesson | Topic |
|---|---|
| 1 | Variables, types, comparison, `if`, loops |
| 2 | Functions |
| 3 | Objects, arrays, destructuring, spread and rest |
| 4 | Array methods: `map`, `filter`, `find`, `some`, `every`, `reduce`, `sort` |
| 5 | Modules: `import` and `export` |
| 6 | Promises, built up from functions as values and arrow functions |
| 7 | `async` and `await` |
| 8 | JSON and `fetch`: GET, POST, status codes and error handling |
| 9 | A small project: a user activity report from a public API (in progress) |

## Running the code

Every lesson is plain JavaScript run with [Node.js](https://nodejs.org/) (version 22 or newer):

```bash
node phase1-javascript/lesson2/lesson2.js
```

Lesson 5 imports its neighbours, so run it from inside its folder: `cd phase1-javascript/lesson5`, then `node main.js`.

## Running the site locally

```bash
cd webapp
npm install
npm run dev        # http://localhost:5173
```

After adding or editing a lesson, run `npm run capture-outputs` to refresh the sample output, and commit the result. [webapp/README.md](webapp/README.md) explains how lessons are found, how to write a guided lesson, and how the notes are wired in.

## Built with

JavaScript on Node.js for the lessons. The site is Vite, React, TypeScript, Tailwind CSS, Shiki and CodeMirror, deployed to GitHub Pages by GitHub Actions. Later basecamps add Python, FastAPI and scikit-learn.
