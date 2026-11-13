# Phase 2: React fundamentals, study notes

These notes explain every React lesson, in the same way the JavaScript notes do for Phase 1. Each lesson has a folder (`lesson1/`, `lesson2/`, ...) with the exercise file to write in.

React code does not run with `node` the way your JavaScript files did. It needs a tool called **Vite** that turns your code into a page the browser can show, and refreshes it every time you save. Setting that up is Part 2 of Lesson 1, and you will type the commands yourself.

React files end in `.jsx` instead of `.js`, because they contain JSX (explained below).

---

# Lesson 1: Components and JSX

## Part 1: what React is, components, JSX (taught, exercise pending)

### The problem React solves

In plain JavaScript, changing a web page means finding elements and editing them by hand. As a page grows, it gets hard to keep track of what changed.

React reverses the job. You describe **what the screen should look like for the current data**, and React updates the page to match. It is like a function in machine learning: `prediction = model(data)`. In React, `screen = component(data)`.

### A component is a function that returns what to show

```jsx
function Greeting() {
  return <h1>Hello, Maruf</h1>;
}
```

A component is a **function**. (In older React it could also be a class, but you will not need that. It is not a file, and not a page.) It takes some data in, and returns a description of a piece of the screen.

### JSX

The `<h1>Hello, Maruf</h1>` inside JavaScript looks like HTML, but it is JavaScript. It is called **JSX**. The browser cannot read JSX, so Vite converts it into ordinary function calls before the page runs.

Two rules to remember:

- A component's name **starts with a capital letter**. `Greeting` works. `greeting` does not: React treats a lowercase name as an ordinary HTML tag, not as your component. (Tested: it draws an unknown `<greeting>` element, and the browser console says "The tag <greeting> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.")
- A component returns **one** parent element. To return several, wrap them in a single `<div>` (or a fragment, `<>...</>`).

### Using a component

You use a component like an HTML tag, and components can be nested inside each other:

```jsx
function App() {
  return (
    <div>
      <Greeting />
      <Greeting />
    </div>
  );
}
```

`App` shows the greeting twice. It was written once and reused, which is the whole point of components.

### Common mistakes

- A lowercase component name (`greeting`), so React draws an unknown HTML tag instead of your component.
- Returning two elements side by side with no wrapper.
- Forgetting the `return`, or writing `Greeting()` instead of `<Greeting />` when using it.

### Exercise status

`app/src/lessons/lesson1/lesson1.jsx`: starter written, not started. The file stays clean: the exercises are listed here and explained in the lesson, not written as comments inside it. It is shown on the page by `app/src/App.jsx` (Part 2 shows how). Keep `npm run dev` running inside `phase2-react/app` and save the file to see your work.

1. Predict first (no code): what appears on the page when `App` is shown, what goes wrong if `Greeting` is renamed `greeting`, and why is everything in `App` wrapped in one `<div>`?
2. Write a `Greeting` component that returns an `<h1>` saying "Hello," and your name.
3. Use `Greeting` twice inside `App`. Predict first what you will see.
4. Write a `Profile` component (an `<h2>` with your name and a `<p>` with your university) and use it in `App`.
5. Rename `Greeting` to lowercase and look at the page. Predict first. Then rename it back.

## Part 2: setting up a React project with Vite (not started)

You will type these commands yourself, in the terminal, from the `phase2-react` folder. Anything in angle brackets is for you to read, not type.

```bash
cd phase2-react
npm create vite@latest app -- --template react
cd app
npm install
npm run dev
```

- `npm create vite@latest app -- --template react` asks Vite's creator tool to make a new project in a folder called `app`, using the plain React (JavaScript) template. `npm` is the package manager you saw with `package.json` in Lesson 5.
- `npm install` downloads the packages the project needs into a `node_modules` folder. It takes a minute and only has to be done once.
- `npm run dev` starts the Vite server and prints an address (usually http://localhost:5173). Open it in the browser. Stop the server with `Ctrl+C`.

The creator tool may ask a few questions (for example which language). Choose plain JavaScript, not TypeScript. If you are unsure, stop and ask.

### The words, in plain language

A web page has three parts: HTML (the structure), CSS (how it looks) and JavaScript (what it does). React builds the page part with JavaScript, and Vite runs and prepares your React code.

| Word | What it is |
|---|---|
| **React** | A JavaScript library (code written by others that you import, started at Meta, free to use) for building the screen out of small reusable pieces called components. It draws the screen. Things like page navigation or fetching data are separate tools you add as needed. |
| **Node.js** | What you used in Phase 1: it takes the JavaScript engine from the browser and lets it run on your own computer (`node lesson1.js` is like `python lesson1.py`). In a React project it only runs the tools (Vite and npm, which comes with Node). Your React code itself runs in the browser. Node can also build servers, but the backend in Phase 3 uses Python and FastAPI. |
| **TypeScript** | JavaScript with types added (`let age: number = 22`), like Java or C++ declarations. The editor and a compiler catch mistakes before you run, such as a misspelled property. Browsers cannot run it, so a tool such as Vite converts it to plain JavaScript first. Files end in `.ts` and `.tsx`. Optional for now: this project uses plain JavaScript (`.jsx`). The Field Guide website is written in TypeScript. |
| **@types/react** | A set of type descriptions that helps the editor give hints and autocomplete, even in plain JavaScript. It does not change how the code runs. |
| **npm** | JavaScript's package manager, like `pip` in Python. `npm install react` is like `pip install numpy`. |
| **package.json** | Like `requirements.txt`, and it also lists your scripts (`npm run dev` runs `vite`). |
| **node_modules** | The folder of downloaded packages, one per project. Never edit it, and never commit it. |
| **Vite** | A tool (said "veet", French for "quick") with three jobs: a **dev server** (a small web server on your own PC, usually http://localhost:5173, that only you can see), translating JSX into ordinary JavaScript the browser can read, and **hot reload** (the page updates the moment you save, without refreshing). |
| **Build** | `npm run build` makes the small, optimised files you would put on a real website. The Field Guide site is built this way: it is a Vite + React project too. |
| **Project generator** | `npm create vite@latest` downloads Vite's starter-project maker, runs it once, and gives you a folder of starting files. |
| **Linter** (Oxlint or ESLint) | A tool that reads your code and warns about likely mistakes, like `pylint` or `flake8` in Python. It never changes how the app runs. Oxlint needs no configuration, so it is the simple choice. |

How they fit together:

```
you write .jsx files  ->  Vite translates them and serves them  ->  your browser shows the page
       (React)                (Node runs Vite, npm installed it)
```

### What the tool creates

I ran the tool in a scratch folder (version 9.3.4; yours may differ slightly) so these notes describe what really appears:

| File or folder | What it is |
|---|---|
| `index.html` | The one HTML page. It has an empty `<div id="root">` and loads `/src/main.jsx`. |
| `src/main.jsx` | The starting point. It finds the `root` div and tells React to draw `<App />` inside it: `createRoot(document.getElementById('root')).render(<App />)`. It wraps it in `<StrictMode>`, which adds extra checks while you develop. |
| `src/App.jsx` | The first component, `App`. The template fills it with a demo (logos and a counter button). You will replace its contents. |
| `src/App.css`, `src/index.css` | Styles. |
| `src/assets/`, `public/` | Images and files served as they are. |
| `package.json` | The project's name, its scripts (`npm run dev` runs `vite`), and the packages it needs: `react` and `react-dom`, plus Vite and its React plugin as development tools. |
| `vite.config.js` | Vite's settings (it switches on the React plugin, so JSX works). |
| `.gitignore` | Keeps `node_modules` out of git. |
| `node_modules/` | Appears after `npm install`. The downloaded packages. Never edit it. |

### Reading the generated `src/App.jsx`

Most of the file is template filler (links and icons). The parts that matter:

```jsx
import { useState } from 'react'          // imports (Lesson 5); you can import images and CSS too
function App() {                          // a component is a function, like Greeting
  const [count, setCount] = useState(0)   // a later lesson (state): ignore for now
  return (                                // what to show
    <>                                    // a "fragment": the one parent a component must return
      ...
    </>
  )
}
export default App                        // main.jsx imports it: import App from './App.jsx'
```

Where JSX differs from HTML:

| In JSX | Why |
|---|---|
| `className="hero"` instead of `class` | `class` is already a JavaScript keyword |
| `{heroImg}`, `{count}` | Curly braces put a JavaScript value into the markup, like `${...}` in a template literal |
| `<img ... />` | Every tag must be closed. A tag with nothing inside closes itself. |

Experiments: delete the `<>` and `</>` wrapper and read the error (a component must return one parent), then undo; add `const name = "..."` above `return` and write `<h1>Hello, {name}</h1>`.

### Exercise status

Not started. After the project runs, we will:

1. Change the text in `src/App.jsx`, save, and watch the page update without a reload.
2. Show the Lesson 1 exercise file from `App`, so you can see your own components on screen. The exercise file lives at `app/src/lessons/lesson1/lesson1.jsx`, and `src/App.jsx` becomes:

```jsx
import Lesson1 from './lessons/lesson1/lesson1.jsx'

function App() {
  return <Lesson1 />
}

export default App
```

The import path is a normal Lesson 5 import: `./` means "the folder this file is in", then down into `lessons/lesson1/`. `<Lesson1 />` uses the default export of that file as a component, like `<Greeting />`.
