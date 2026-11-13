# Learning Progress

Last updated: 2026-11-13

## Current Status

- **Current phase:** Phase 2 - React Fundamentals. Phase 1 (JavaScript) is complete, 2026-11-13.
- **Current topic:** Lesson 1 part 1, what React is, components and JSX (taught, exercise pending). Then part 2, setting up a Vite + React project by hand. Notes: `phase2-react/NOTES.md`
- **Next learning task:** answer item 1 (questions only) in `phase2-react/lesson1/lesson1.jsx`, then do part 2 of the notes: create the project with `npm create vite@latest app -- --template react` yourself. Items 2 to 5 need the project.

## Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| 1 | JavaScript fundamentals and revision | Complete (2026-11-13) |
| 2 | React fundamentals (Vite, JSX, props, state, effects, forms) | In progress (Lesson 1) |
| 3 | Backend with Python and FastAPI | Not started |
| 4 | React + FastAPI integration | Not started |
| 5 | Machine Learning integration (scikit-learn model behind an API) | Not started |
| 6 | Modern AI app development (LLM APIs, RAG, auth, deployment) | Not started |

## Completed Topics

- JS Lesson 1: variables (let/const), types, template literals, ===, if, loops (for, for...of, while) - 2026-11-05. Exercises passed. Own-words write-ups and recap questions were skipped (strong C, C++ and Java background, see below).
- JS Lesson 2: functions (declarations, arrow functions, default parameters, callbacks, hoisting, scope) - 2026-11-05.- JS Lesson 3: objects, arrays, destructuring, spread, rest parameters - 2026-11-06.- JS Lesson 4 part 1: map, filter, find - 2026-11-06.- JS Lesson 5: modules (named and default exports, imports, renaming, ES modules in Node) - 2026-11-06.- JS Lesson 7: async/await (`async` functions, `await`, `try`/`catch`, forgetting `await` gives a promise) - 2026-11-09. Item 5 prediction first mixed up "missing await" (gives a promise) with "missing return" (gives undefined).
- JS Lesson 6: promises (a promise as a box, `resolve` and `reject` as buttons, `then`, `catch`, chaining) - 2026-11-08. Started with three small steps on functions as values and arrow functions, because the first explanation was too fast.
- JS Lesson 4 part 2: some, every, reduce, sort - 2026-11-06.
- JS Lesson 9: mini project, a user activity report (`getJson`, `loadData`, `buildReport` with `map`/`filter`, `console.table`, a two-pass `findTopUser` that handles a tie, `main()` with one `try`/`catch`) - 2026-11-13. Wrote `buildReport` and the tie handling themselves, working from a step-by-step plan.
- JS Lesson 8 part 2: errors and POST (`response.ok`, throwing on a bad status, network failure vs a 404, GET vs POST, `method`/`headers`/`body`, why the body needs `JSON.stringify`) - 2026-11-13. The terms GET and POST had to be taught from scratch.
- JS Lesson 8 part 1: `JSON.stringify` and `JSON.parse`, GET with `fetch`, the second `await` for `response.json()`, a 404 does not reject (`response.ok` is false) - 2026-11-09. Item 2 prediction was wrong (`fetch(url)` prints `Promise { <pending> }`).
## Topics I Understand

- Phase 1 final check (2026-11-13): wrote `applyTwice`, `sum(...nums)` and a `filter` then `map` chain correctly; explained rest vs spread (`sum(...nums)` vs `sum(...[4, 5, 6])`) and why `map` with braces and no `return` gives `undefined` values.
- Programming fundamentals: strong prior experience in C, C++ and Java (self-reported). JavaScript is the unfamiliar part, so lessons focus on how JS differs.
- JS Lesson 1 topics, verified by exercises (lesson1/lesson1a.js, lesson1b.js, lesson1c.js)
- Functions as values and callbacks: `sayHi` vs `sayHi()`, passing a function to another function, and why a timer runs it later (Lesson 6 basics, steps 1-3, answered correctly in their own words, 2026-11-08). Arrow functions (with and without braces) and returning vs printing a value (Step 4, after one correction).

## Topics I Struggle With

- Destructuring and spread (needed a second, step-by-step explanation in Lesson 3; warm-ups B, C, D then correct).
- Rest parameters (`...nums` in a parameter list) were unclear at first.
- Arrow functions with braces: forgot that `{ }` needs an explicit `return` (Lesson 4 item 6 prediction was wrong). Watch for this again.
- Promises (Lesson 6): the first explanation was too fast. The gap underneath is passing a function to another function to be run later (callbacks), so Lesson 6 now starts with three small steps from zero.
- Chaining array methods: each step receives the previous step's output, so `map` before `filter` loses the data `filter` needed (Lesson 4 item 5).
- HTTP basics (Lesson 8 part 2): the words GET and POST were used before they were explained, so the POST items needed a re-teach from scratch. Explain a new term before using it.
- Writing predictions: several "My prediction:" lines in Lesson 8 were left blank. The prediction is the learning step, so do it before running.
- No diagnostic was taken; other weak spots will show up in exercises.

## To revisit

Retype these from memory in a later session, to check they have really stuck. (`applyTwice`, `sum(...nums)` and a `filter` then `map` chain were checked on 2026-11-13.)
- `wait(ms)` and `getStudent(name)` with `resolve` and `reject` (promises)
- A POST with `fetch` (`method`, `headers`, `JSON.stringify` body) and `createPost(title, body)` with an `ok` check

## Exercises Completed

- lesson1/lesson1a.js (variables, types, template literals, const error)
- lesson1/lesson1b.js (if chain, === vs ==, logical operators)
- lesson1/lesson1c.js (for, for...of, accumulator and counter)
- lesson2/lesson2.js (average, isPassing with default parameter; applyTwice and argument handling)
- lesson3/lesson3.js (warm-ups A-D, destructuring, spread, rest parameters)
- lesson4/lesson4a.js (map, filter, find)
- lesson4/lesson4b.js (some, every, reduce, sort)
- lesson5/ (mathUtils.js, students.js, main.js, scratch.js: named and default exports)
- lesson6/basics.js (functions as values, callbacks, arrow functions, printing vs returning)
- lesson6/lesson6.js (print order, wait, getStudent with resolve and reject, then chain, missing return)
- lesson7/lesson7.js (pause, showScore, try/catch, Aisha plus 5, forgetting await)
- lesson8/lesson8a.js (JSON stringify and parse, fetch one user, fetch all users, a 404, forgetting the second await)
- lesson8/lesson8b.js (getUser with an ok check, one try/catch, network failure, POST, a POST without JSON.stringify, createPost)
- lesson9/lesson9.js (mini project: user activity report from three API lists)

## Projects Completed

None yet.

## Resources Recommended

- JavaScript Tutorial for Beginners: Learn JavaScript in 1 Hour - Programming with Mosh (basics revision only; chapter timestamps not verified)
- javascript.info - https://javascript.info/ (primary reference for the Phase 1 gaps)
- MDN JavaScript Guide - https://developer.mozilla.org/en-US/docs/Web/JavaScript
- Phase 2 (React), primary: the official Learn React docs - https://react.dev/learn (verified 2026-11-13; sections: creating and nesting components, JSX, styles, displaying data, conditional rendering, lists, events, updating the screen, hooks, sharing data between components). It does not mention Vite, so the project is set up with Vite alongside it.
- Phase 2 (React), optional video: Learn the React JavaScript Library With This Free 10-Hour YouTube Course - John Smilga (Coding Addict), freeCodeCamp - https://www.youtube.com/watch?v=4UZrsTqkcW4 . Section titles verified from https://www.freecodecamp.org/news/react-10-hour-course/ , but it gives no timestamps and does not mention Vite. Use only the sections needed (JSX, props, useState, useEffect, forms, fetching data); do not watch all 10 hours.

## Notes

- Background: Python, NumPy, Pandas, classical ML, basic PyTorch; Andrew Ng ML Specialization Course 1 done.
- Target pace: about 3-4 hours per week, adjusted around university workload.
