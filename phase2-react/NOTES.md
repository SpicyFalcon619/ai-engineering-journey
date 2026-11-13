# Phase 2: React fundamentals, study notes

These notes explain every React lesson, in the same way the JavaScript notes do for Phase 1. Each lesson has a folder (`lesson1/`, `lesson2/`, ...) with the exercise file to write in.

## How to run your work

React code does not run with `node`. A tool called **Vite** serves it to the browser while you work and refreshes the page whenever you save. This folder is already set up for it:

```bash
cd phase2-react
npm install        # first time only: downloads React and Vite into node_modules
npm run dev        # starts the lesson viewer, then open the address it prints
```

Open the address (usually http://localhost:5173). Along the top you will see a link for each lesson file (`lesson1/lesson1.jsx`). Click one: the page shows whatever that file's `App` component returns. Save the file and the page updates by itself. Stop the server with `Ctrl+C`.

`src/main.jsx` is the viewer. You do not need to read it yet. When we set up a real project from scratch later in Phase 2, you will run Vite yourself.

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

- A component's name **starts with a capital letter**. `Greeting` works. `greeting` does not: React treats a lowercase name as an ordinary HTML tag, not as your component.
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

`lesson1/lesson1.jsx`: starter written, not started. Run it as described at the top of these notes.

1. Predict first (no code): what appears on the page when `App` is shown, what goes wrong if `Greeting` is renamed `greeting`, and why is everything in `App` wrapped in one `<div>`?
2. Write a `Greeting` component that returns an `<h1>` saying "Hello," and your name.
3. Use `Greeting` twice inside `App`. Predict first what you will see.
4. Write a `Profile` component (an `<h2>` with your name and a `<p>` with your university) and use it in `App`.
5. Rename `Greeting` to lowercase and look at the page. Predict first. Then rename it back.
