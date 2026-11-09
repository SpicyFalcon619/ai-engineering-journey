# AI Engineering Journey

My notes and code from learning to build AI-powered applications, from JavaScript up to a React frontend talking to a Python backend with a machine learning model behind it. Everything is written to be followed by a beginner, in order.

## The Field Guide

The easiest way to read it is the site: **[Open the AI Engineering Field Guide](https://spicyfalcon619.github.io/ai-engineering-journey/)**.

Every lesson shows the real code beside the real output it printed, and any block can be edited and run in the page. It is built from the `.js` files in this repo, so it always matches what is here. Its source is in [webapp/](webapp); see [webapp/README.md](webapp/README.md) to run it locally or add a lesson. It is the same app as my [ML Field Guide](https://spicyfalcon619.github.io/ml-research-journey/) and [Java Field Guide](https://spicyfalcon619.github.io/java-field-guide/), and the three link to each other.

## The path

React frontend → API communication → Python (FastAPI) backend → machine learning model → prediction → back to the frontend.

1. JavaScript fundamentals (in progress)
2. React fundamentals
3. Backend development with Python and FastAPI
4. React + FastAPI integration
5. Machine learning integration
6. Modern AI application development (LLM APIs, RAG, authentication, deployment)

The checklist is [ROADMAP.md](ROADMAP.md), which the site reads for its progress view. My running record of what is done and what is next is [LEARNING_PROGRESS.md](LEARNING_PROGRESS.md).

## What's in the repo

- **phase1-javascript/**: JavaScript fundamentals. [NOTES.md](phase1-javascript/NOTES.md) is the study reference for every lesson. Each lesson has its own folder with the exercise files:
  - `lesson1/`: variables, types, comparison, `if`, loops
  - `lesson2/`: functions
  - `lesson3/`: objects, arrays, destructuring, spread and rest
  - `lesson4/`: array methods (`map`, `filter`, `find`, `some`, `every`, `reduce`, `sort`)
  - `lesson5/`: modules (`import` and `export`)
  - `lesson6/`: promises, built up from functions as values and arrow functions
  - `lesson7/`: `async` and `await`
  - `lesson8/`: JSON and `fetch` (in progress)
  - `lesson9/`: a small project that fetches data from a public API (coming next)
- **webapp/**: the website, and the script that captures each lesson's real output.
- **ROADMAP.md**: the six basecamps as a checklist.
- **LEARNING_PROGRESS.md**: current phase, completed topics, topics I find hard, and what is next.

## Running the code

Every lesson is plain JavaScript run with [Node.js](https://nodejs.org/):

```bash
node phase1-javascript/lesson2/lesson2.js
```

For `lesson5/`, run the entry file from inside its folder: `cd phase1-javascript/lesson5` then `node main.js`.

## Built with

JavaScript (Node.js). The site uses Vite, React, TypeScript, Tailwind CSS, Shiki and CodeMirror, and is deployed to GitHub Pages by GitHub Actions. Later phases add Python, FastAPI and scikit-learn.
