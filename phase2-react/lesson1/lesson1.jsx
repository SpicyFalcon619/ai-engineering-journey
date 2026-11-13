// Lesson 1: what React is, components and JSX
//
// Read Lesson 1 in NOTES.md first.
//
// Item 1 is only questions: answer it in the comments now.
// Items 2 to 5 are code. To see them on screen you need a React project, which you set up in NOTES.md,
// Lesson 1 part 2. After that, this file moves into the project and App shows it.

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
