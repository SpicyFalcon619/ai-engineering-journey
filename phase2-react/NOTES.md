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

`lesson1/lesson1.jsx`: starter written, not started. Item 1 is only questions, so you can answer it now. Items 2 to 5 need the project from Part 2.

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

### Exercise status

Not started. After the project runs, we will:

1. Change the text in `src/App.jsx`, save, and watch the page update without a reload.
2. Move the Lesson 1 exercise file into the project and show it from `App`, so you can see your own components on screen.
