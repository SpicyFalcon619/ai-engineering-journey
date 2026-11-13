// Lesson 2: props
//
// Props are the inputs of a component: <Greeting name="Aisha" /> calls the function with { name: "Aisha" }.
// Strings go in quotes, anything else in braces (age={22}). A component never changes its own props.
// Notes: phase2-react/NOTES.md, Lesson 2.

// One prop. { name } in the parameter list picks the prop out of the props object (destructuring).
// = "friend" is a default: it is used only when the prop is missing. Without it, a missing prop is undefined,
// and React draws nothing for undefined, so you would see just "Hello, " with no error.
function Greeting({ name = "friend" }) {
  return <h1>Hello, {name}</h1>;
}

// Two props: list them with commas. It still returns ONE parent element (the <div>).
function Profile({ name, university }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{university}</p>
    </div>
  );
}

// The same components are reused with different props: three greetings, one with no name (so "friend"), and two profiles.
export default function Lesson2() {
  return (
    <div>
      <Greeting name="Aisha" />
      <Greeting name="Rahim" />
      <Greeting name="Karim" />
      <Greeting />
      <Profile name="Aisha" university="UIU" />
      <Profile name="Rahim" university="BUET" />
    </div>
  );
}
