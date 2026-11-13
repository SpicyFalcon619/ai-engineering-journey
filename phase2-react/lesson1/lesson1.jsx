// Lesson 1: what React is, components and JSX
//
// Read Lesson 1 in NOTES.md first. To see your work on screen:
//   1. In a terminal, go to the phase2-react folder (cd phase2-react).
//   2. First time only: npm install
//   3. npm run dev, then open the address it prints (usually http://localhost:5173).
//   4. Click "lesson1/lesson1.jsx" at the top. Save this file and the page updates by itself.
//
// The page shows whatever the default export of this file returns (the App component below).

// --- 1. Predict first (no code) ---
// Look at the Greeting and App example in NOTES.md (Lesson 1).
// a) What appears on the page when App is shown?
// My prediction:
// b) What goes wrong if Greeting is renamed to greeting (lowercase)?
// My answer:
// c) Why is everything in App wrapped in one <div>?
// My answer:

// --- 2. Greeting ---
// Write a component Greeting that returns an <h1> saying "Hello, " and your name.
// TODO

// --- 3. Use it twice ---
// In App, show Greeting two times, inside the one <div>.
// Predict first: what will you see on the page?
// My prediction:
export default function App() {
  return (
    <div>
      {/* TODO: use Greeting here, twice */}
    </div>
  );
}

// --- 4. A second component ---
// Write a component Profile that returns a <div> holding an <h2> with your name and a <p> with your
// university. Then use it in App, under the greetings.
// TODO

// --- 5. Break it on purpose ---
// Rename Greeting to lowercase greeting (also where App uses it) and look at the page.
// Predict first: does it show an error, or does it quietly show something else? What do you expect to see?
// My prediction:
// TODO: when you have seen the result, rename it back.
