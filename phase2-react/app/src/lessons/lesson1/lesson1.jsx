// Lesson 1: components and JSX
//
// A component is a function whose name starts with a capital letter and that returns JSX (markup written inside
// JavaScript). Notes: phase2-react/NOTES.md, Lesson 1.

// Component 1: returns one element. The <h1> looks like HTML but is JSX.
function Greeting() {
  return <h1>Hello, Maruf</h1>;
}

// Component 2: a component returns ONE parent element. The <h2> and the <p> would be two values side by side,
// so they sit inside one <div>.
function Profile() {
  return (
    <div>
      <h2>Maruf Hossain</h2>
      <p>United International University</p>
    </div>
  );
}

// The component shown on the page (src/App.jsx imports it as Lesson1).
// - Capital letter: <Greeting /> runs the function. A lowercase <greeting /> is treated as an HTML tag, so React
//   never runs the function, and the page shows nothing with no error (only a warning in the browser console).
// - One parent: everything is inside one <div>. Use <>...</> instead to add no extra element to the page.
// - Reuse: Greeting is written once and drawn twice.
export default function Lesson1() {
  return (
    <div>
      <Greeting />
      <Greeting />
      <Profile />
    </div>
  );
}
