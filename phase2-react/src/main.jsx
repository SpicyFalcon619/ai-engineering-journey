// The lesson viewer. You do NOT need to understand this file yet: it only shows whichever lesson you pick, the way
// `node lesson1.js` runs one JavaScript file. Your own work goes in the lessonN folders.
//
// It finds every file named lessonN/lessonN*.jsx, lists them along the top, and draws the default export of the one
// you pick (the address ends with #lesson1/lesson1.jsx).
import { Component, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

// Loaded only when picked, so a mistake in one lesson does not break the others.
const lessonFiles = import.meta.glob("../lesson*/*.jsx");
const names = Object.keys(lessonFiles)
  .map((path) => path.replace("../", ""))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

// Shows a lesson's error on the page instead of a blank screen.
class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return <pre className="viewer-error">{String(this.state.error)}</pre>;
    }
    return this.props.children;
  }
}

function Viewer() {
  const [current, setCurrent] = useState(window.location.hash.slice(1) || names[names.length - 1]);
  const [Lesson, setLesson] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const onHash = () => setCurrent(window.location.hash.slice(1));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    setLesson(null);
    setLoadError(null);
    const load = lessonFiles[`../${current}`];
    if (!load) return;
    load()
      .then((module) => setLesson(() => module.default))
      .catch((error) => setLoadError(error));
  }, [current]);

  return (
    <>
      <nav className="viewer-bar">
        <strong>Lessons</strong>
        {names.map((name) => (
          <a key={name} href={`#${name}`} className={name === current ? "current" : ""}>
            {name}
          </a>
        ))}
      </nav>
      <main className="viewer-stage">
        {names.length === 0 && <p>No lessons yet.</p>}
        {loadError && <pre className="viewer-error">{String(loadError)}</pre>}
        {!loadError && Lesson && (
          <ErrorBoundary key={current}>
            <Lesson />
          </ErrorBoundary>
        )}
        {!loadError && !Lesson && current && !lessonFiles[`../${current}`] && <p>No lesson called {current}.</p>}
      </main>
    </>
  );
}

createRoot(document.getElementById("root")).render(<Viewer />);
