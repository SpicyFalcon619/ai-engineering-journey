import { lazy, Suspense, useState } from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { cn } from '@/lib/cn'

// The editor and the runner load only when this page is opened.
const LiveJs = lazy(() => import('@/components/code/LiveJs'))

const STORAGE_KEY = 'aefg-sandbox-code'

const EXAMPLES: { id: string; label: string; code: string }[] = [
  {
    id: 'hello',
    label: 'Hello',
    code: `// Change anything, then press Run (or Ctrl+Enter).
const name = "world";
console.log(\`Hello, \${name}!\`);

for (let i = 1; i <= 5; i++) {
  console.log(\`\${i} squared is \${i * i}\`);
}
`,
  },
  {
    id: 'arrays',
    label: 'Array methods',
    code: `const students = [
  { name: "Aisha", score: 82 },
  { name: "Rahim", score: 45 },
  { name: "Mina", score: 91 },
];

const passing = students.filter((s) => s.score >= 60);
console.log(passing.map((s) => s.name));

const total = students.reduce((sum, s) => sum + s.score, 0);
console.log("Average:", total / students.length);

console.log([...students].sort((a, b) => b.score - a.score).map((s) => s.name));
`,
  },
  {
    id: 'destructuring',
    label: 'Destructuring and spread',
    code: `const student = { name: "Aisha", score: 82, tags: ["ml", "python"] };

const { name, score } = student;
console.log(name, score);

// A changed copy: the original stays as it was.
const updated = { ...student, score: 70 };
console.log(student.score, updated.score);

const sum = (...nums) => nums.reduce((total, n) => total + n, 0);
console.log(sum(1, 2, 3, 4));
`,
  },
  {
    id: 'promises',
    label: 'Promises',
    code: `const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

console.log("start");
wait(500).then(() => console.log("half a second later"));
console.log("this prints before the line above");
`,
  },
  {
    id: 'async',
    label: 'async and await',
    code: `const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function countdown() {
  for (let n = 3; n > 0; n--) {
    console.log(n);
    await wait(400);
  }
  console.log("go");
}

countdown();
console.log("the countdown runs while this line prints");
`,
  },
  {
    id: 'fetch',
    label: 'fetch and JSON',
    code: `// This asks a free practice API for a user. It needs an internet connection.
async function main() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
    if (!response.ok) throw new Error(\`Request failed: \${response.status}\`);
    const user = await response.json();
    console.log(user.name, "-", user.email);
  } catch (error) {
    console.log("Something went wrong:", error.message);
  }
}

main();
`,
  },
]

function stored(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function SandboxPage() {
  useDocumentTitle('Sandbox')
  const [code, setCode] = useState(() => stored() ?? EXAMPLES[0].code)
  // Picking an example replaces the editor, so it is given a new identity to start fresh.
  const [version, setVersion] = useState(0)

  const remember = (next: string) => {
    setCode(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Not remembering the text is fine.
    }
  }

  const pick = (example: (typeof EXAMPLES)[number]) => {
    remember(example.code)
    setVersion((v) => v + 1)
  }

  return (
    <div className="mx-auto max-w-4xl animate-fade-up pb-16">
      <header className="mb-6">
        <h1 className="text-5xl leading-none font-bold text-[var(--color-ink)] sm:text-6xl">Sandbox</h1>
        <p className="mt-2 max-w-2xl text-[var(--color-ink-dim)]">
          Write your own JavaScript and run it here. It runs inside your browser, in a sandboxed frame, so nothing you type is sent anywhere.
          There is nothing to download or wait for.
        </p>
      </header>

      <div className="mb-3 flex flex-wrap items-center gap-2" role="group" aria-label="Start from an example">
        <span className="text-sm text-[var(--color-ink-faint)]">Start from</span>
        {EXAMPLES.map((example) => (
          <button
            key={example.id}
            type="button"
            onClick={() => pick(example)}
            className={cn(
              'min-h-6 cursor-pointer rounded-md border border-[var(--color-border)] px-2.5 py-0.5 text-sm text-[var(--color-ink-dim)] transition-colors',
              'hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]',
            )}
          >
            {example.label}
          </button>
        ))}
      </div>

      <div className="guide-code code-font">
        <Suspense fallback={<p className="guide-part-none">Opening the editor...</p>}>
          <LiveJs key={version} initialCode={code} onCodeChange={remember} variant="page" label="JavaScript sandbox editor" session="sandbox" />
        </Suspense>
      </div>

      <ul className="mt-4 max-w-2xl list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--color-ink-faint)]">
        <li>
          Runs remember each other, like cells in a notebook: a variable or function from one run is still there in the next. Press Reset
          variables to forget them. Picking an example starts clean.
        </li>
        <li>
          Print with <code>console.log</code>. There is no keyboard input and no file access, because the code runs in the page.
        </li>
        <li>
          The run ends when nothing is left to wait for: no timers (<code>setTimeout</code>) and no requests (<code>fetch</code>) still pending.
        </li>
        <li>Press Stop to end a script that never finishes. A script still running after twenty seconds is stopped for you.</li>
        <li>
          <code>fetch</code> works with sites that allow it from any page, such as the practice API in the last example.
        </li>
        <li>
          Importing other files (<code>import ... from "./other.js"</code>) is not available here. Lessons that need it show their sample output only.
        </li>
      </ul>
    </div>
  )
}
