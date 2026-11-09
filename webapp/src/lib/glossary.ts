// Plain-language meanings of the words that make beginners stop reading. A lesson never has to stop and
// explain a word like "callback": the first time it appears in a block of explanation it is underlined,
// and a tap or hover shows the short meaning with a link to the longer one here.
//
// To add a word: give it an id (lowercase, dashes), the term as written, any other spellings that should
// be recognised (plural, abbreviation), a `short` meaning that fits in one sentence, and a `long` one
// with an everyday comparison where it helps. `lesson` names the lesson file (by its title) to read next.

export interface GlossaryEntry {
  id: string
  term: string
  aliases?: string[]
  short: string
  long: string
  /** Title of the lesson that teaches it properly. */
  lesson?: string
  /**
   * False for words that are also everyday English (object, loop, return): they are explained on the glossary
   * page, but never underlined automatically in a lesson, where that would only get in the way.
   */
  auto?: boolean
}

export const GLOSSARY: GlossaryEntry[] = [
  // ------------------------------------------------------------------ the basics
  {
    id: 'variable',
    term: 'variable',
    aliases: ['variables'],
    short: 'A name that points to a value, so the program can use it again later.',
    long: 'A variable is a labelled box. You put a value in (const age = 22), and wherever you write the label, JavaScript uses what is in the box. In JavaScript you declare one with const or let.',
  },
  {
    id: 'const-let',
    term: 'const',
    aliases: ['let'],
    short: 'The two ways to declare a variable. const cannot be reassigned; let can.',
    long: 'Use const by default. It stops the name being pointed at a different value later, which prevents accidents. Use let only when the value really has to change, such as a counter. Note that const does not freeze what is inside an array or object: you can still change its contents, only not replace the whole thing.',
    auto: false,
  },
  {
    id: 'string',
    term: 'string',
    aliases: ['strings'],
    short: 'Text, written between quotes.',
    long: 'A string is a piece of text, such as "hello". Strings can be joined together, and a template literal (backticks) can place other values inside them.',
  },
  {
    id: 'template-literal',
    term: 'template literal',
    aliases: ['template literals'],
    short: 'A string in backticks that can contain values written as ${...}.',
    long: 'Instead of joining text with +, write `Hello ${name}`. Whatever is inside ${ } is worked out and placed into the text. It is JavaScript\'s version of a Python f-string.',
  },
  {
    id: 'type',
    term: 'type',
    aliases: ['types', 'data type', 'data types'],
    short: 'What kind of value something is: a number, text, true or false, and so on.',
    long: 'JavaScript has number, string, boolean, undefined, null, object (arrays are objects) and a few others. You never write a type down, JavaScript works it out from the value. typeof tells you what you have.',
    auto: false,
  },
  {
    id: 'undefined',
    term: 'undefined',
    short: 'The value of something that has not been given a value yet.',
    long: 'You get undefined when you read a property that does not exist, a variable that was declared with no value, or the result of a function that never returns anything. Seeing undefined where you expected a value usually means something was never set, or a return was forgotten.',
  },
  {
    id: 'nan',
    term: 'NaN',
    short: 'Short for "not a number": what a calculation gives when it cannot make sense.',
    long: 'undefined + 1 and "hello" * 2 both give NaN. It is a quiet failure: the program carries on with a useless number instead of stopping, so it is worth knowing what it looks like.',
  },
  {
    id: 'truthy-falsy',
    term: 'truthy',
    aliases: ['falsy'],
    short: 'How a value behaves inside an if: falsy values count as false, everything else counts as true.',
    long: 'The falsy values are false, 0, an empty string, null, undefined and NaN. Everything else is truthy, including an empty array and any object. That is why if (student) works: an object counts as "something is here", undefined counts as "nothing".',
  },
  {
    id: 'strict-equality',
    term: 'strict equality',
    aliases: ['==='],
    short: 'The comparison === checks the value and the type together. Use it instead of ==.',
    long: '5 === "5" is false because a number is not a string. The looser == converts types first and gives surprising answers (5 == "5" is true), so the rule is: always write ===.',
  },
  // ------------------------------------------------------------------ functions
  {
    id: 'function',
    term: 'function',
    aliases: ['functions'],
    short: 'A named recipe: code you write once and can run whenever you need it.',
    long: 'Writing a function only writes the recipe down. Calling it, with brackets, is what cooks it. A function can take inputs (parameters) and hand back a result (a return value).',
  },
  {
    id: 'arrow-function',
    term: 'arrow function',
    aliases: ['arrow functions'],
    short: 'A shorter way to write a function, with =>.',
    long: '(n) => n * 2 reads as "given n, give back n * 2". Without braces the value is returned automatically; with braces you must write return yourself. Arrow functions are everywhere in modern JavaScript and in React.',
  },
  {
    id: 'parameter',
    term: 'parameter',
    aliases: ['parameters', 'argument', 'arguments'],
    short: 'A value a function receives when it is called.',
    long: 'In function add(a, b), a and b are parameters. In add(2, 3), the 2 and 3 are the arguments. JavaScript does not check them: a missing one is undefined and an extra one is ignored.',
  },
  {
    id: 'return-value',
    term: 'return value',
    aliases: ['returns', 'returning'],
    short: 'The result a function hands back to whoever called it.',
    long: 'Returning is not the same as printing. console.log shows something on the screen; return gives a value back so other code can use it. A function with no return gives back undefined.',
    auto: false,
  },
  {
    id: 'callback',
    term: 'callback',
    aliases: ['callbacks'],
    short: 'A function you hand to another function, to be run later or once per item.',
    long: 'map, filter, setTimeout and promise.then all take a callback. You pass the function itself (no brackets), and the other function decides when to call it. This idea is the key to promises.',
  },
  {
    id: 'scope',
    term: 'scope',
    short: 'Where a variable can be seen.',
    long: 'let and const exist only inside the nearest pair of braces { }. A function can read variables from the code around it.',
    auto: false,
  },
  {
    id: 'closure',
    term: 'closure',
    aliases: ['closures'],
    short: 'A function that remembers the variables around it, even after that code has finished.',
    long: 'If a function returns another function, the inner one keeps access to the variables it was created next to. A counter that remembers its count is the classic example. React hooks depend on this.',
  },
  {
    id: 'hoisting',
    term: 'hoisting',
    short: 'Function declarations can be used before the line where they are written.',
    long: 'JavaScript sets up function declarations before running the rest of the file, so calling one above its definition works. A function stored in a const (an arrow function) is not set up early.',
  },
  // ------------------------------------------------------------------ data
  {
    id: 'array',
    term: 'array',
    aliases: ['arrays'],
    short: 'An ordered list of values, counted from 0.',
    long: 'An array like [82, 45, 91] is JavaScript\'s list. scores[0] is the first item and scores.length is how many there are. Arrays can hold any mix of values.',
  },
  {
    id: 'object',
    term: 'object',
    aliases: ['objects'],
    short: 'A collection of named values: { name: "Aisha", score: 82 }.',
    long: 'Each entry is a property with a key and a value. You read one with a dot (student.name). You can add or change properties at any time, and objects can contain other objects and arrays.',
    auto: false,
  },
  {
    id: 'property',
    term: 'property',
    aliases: ['properties'],
    short: 'One named value inside an object.',
    long: 'In { name: "Aisha" }, name is the key of a property whose value is "Aisha". Reading a property that does not exist gives undefined, not an error.',
    auto: false,
  },
  {
    id: 'array-methods',
    term: 'array method',
    aliases: ['array methods', 'map', 'filter', 'reduce'],
    short: 'Tools every array has, such as map, filter, find, some, every, reduce and sort.',
    long: 'Each takes a callback and calls it once per item. map makes a new array of the same length, filter keeps some items, find returns the first match, reduce boils everything down to one value. They replace the loop-plus-empty-array pattern.',
  },
  {
    id: 'destructuring',
    term: 'destructuring',
    short: 'Pulling values out of an object or array into variables in one line.',
    long: 'const { name, score } = student creates name and score from the student object. const [first, second] = scores picks by position. It is how React components receive their inputs.',
  },
  {
    id: 'spread',
    term: 'spread',
    aliases: ['spread operator'],
    short: 'The three dots ... that expand an array or object in place, to copy or combine it.',
    long: '{ ...student, score: 70 } makes a new object with the old properties and a changed score; the original is untouched. React state updates work this way. The same dots in a parameter list collect values instead (a rest parameter).',
  },
  {
    id: 'rest-parameter',
    term: 'rest parameter',
    aliases: ['rest parameters'],
    short: 'A parameter written ...nums that gathers all the extra arguments into an array.',
    long: 'function sum(...nums) can be called as sum(1, 2, 3, 4): nums is then [1, 2, 3, 4]. It must be the last parameter.',
  },
  {
    id: 'shallow-copy',
    term: 'shallow copy',
    short: 'A copy that duplicates the top level only: anything nested is still shared.',
    long: 'Spread copies one level. If an object contains an array, the copy and the original point at the same array. Assigning with = does not copy at all, it just gives the same object a second name.',
  },
  // ------------------------------------------------------------------ modules
  {
    id: 'module',
    term: 'module',
    aliases: ['modules'],
    short: 'A file whose contents are private until it exports them.',
    long: 'Splitting a program into modules keeps each file small. A file shares things with export, and another file picks them up with import. Every React project is hundreds of modules connected this way.',
  },
  {
    id: 'named-export',
    term: 'named export',
    aliases: ['named exports'],
    short: 'An export you ask for by its name, in braces: import { add } from "./x.js".',
    long: 'A file can have many named exports. The importing side must use the same names (or rename them with as).',
  },
  {
    id: 'default-export',
    term: 'default export',
    aliases: ['default exports'],
    short: 'The one main thing a file exports, imported with no braces and any name you like.',
    long: 'export default students; is imported as import students from "./students.js". A file can have only one. React components are usually default exports.',
  },
  // ------------------------------------------------------------------ asynchronous code
  {
    id: 'asynchronous',
    term: 'asynchronous',
    aliases: ['async', 'asynchronously'],
    short: 'Started now, finished later, while the rest of the program carries on.',
    long: 'Slow things such as a network request or a timer do not make JavaScript stand and wait. It starts them, moves on to the next line, and handles the result when it arrives. That is why the line after setTimeout prints first.',
  },
  {
    id: 'promise',
    term: 'promise',
    aliases: ['promises'],
    short: 'An object standing for a value that is not available yet: a box you are handed now, filled later.',
    long: 'A promise is pending, then either fulfilled with a value or rejected with an error. resolve presses the button that fills it, reject presses the failure button, and .then runs when it is filled. fetch returns a promise.',
  },
  {
    id: 'then-catch',
    term: 'then',
    aliases: ['catch', '.then', '.catch'],
    short: 'How you use a promise: .then runs on success, .catch on failure.',
    long: 'Each .then returns a new promise, so you can chain steps; whatever a step returns is passed to the next. One .catch at the end handles a failure in any step above it. Forgetting to return inside a step passes undefined on.',
    auto: false,
  },
  {
    id: 'async-await',
    term: 'await',
    aliases: ['async function', 'async/await'],
    short: 'async marks a function that may wait; await pauses it until a promise is ready, then gives back its value.',
    long: 'async and await are a cleaner way to write promise code: the same boxes, but it reads from top to bottom. Without await you get the promise itself (Promise { <pending> }), not the value inside. Use try and catch for errors.',
  },
  {
    id: 'timeout',
    term: 'setTimeout',
    short: 'Runs a function later, after a number of milliseconds.',
    long: 'setTimeout(fn, 1000) hands fn to a timer and carries on at once; the timer calls it a second later. It is the simplest stand-in for any slow operation.',
  },
  // ------------------------------------------------------------------ talking to servers
  {
    id: 'json',
    term: 'JSON',
    short: 'Text that looks like a JavaScript object: the format for sending data between programs.',
    long: 'A network can only carry text, so objects are turned into JSON to be sent and back into objects when they arrive. JSON.stringify(object) makes the text; JSON.parse(text) makes the object. Keys and text values need double quotes.',
  },
  {
    id: 'fetch',
    term: 'fetch',
    short: 'The built-in way to ask another computer for something over the web.',
    long: 'fetch(url) returns a promise for a Response. The data is in a second box: await response.json(). A missing page (404) still counts as an answer, so check response.ok yourself.',
  },
  {
    id: 'api',
    term: 'API',
    aliases: ['APIs', 'REST API'],
    short: 'A set of addresses a program can ask for data or actions.',
    long: 'A web API is like a menu: you request /users/1 and get back that user as JSON. Your React frontend will call an API that you build in Python with FastAPI.',
  },
  {
    id: 'status-code',
    term: 'status code',
    aliases: ['status codes', 'HTTP status'],
    short: 'A number in every web response that says how the request went: 200 fine, 404 not found, 500 server error.',
    long: 'response.status holds the number and response.ok is true for 200 to 299. fetch does not throw for a 404 or 500, so reading the status is how you notice a failed request.',
  },
  {
    id: 'node',
    term: 'Node.js',
    aliases: ['Node'],
    short: 'A program that runs JavaScript outside the browser, on your own computer.',
    long: 'You run a file with node file.js. The output in this guide was captured by running each lesson with Node. The same language runs in the browser, where it can also change web pages.',
  },
  {
    id: 'console-log',
    term: 'console.log',
    short: 'Prints a value, for you to read. It is JavaScript\'s print.',
    long: 'console.log(student) shows the whole object in a readable form, for debugging. Putting an object inside a template literal gives the useless text [object Object]; use JSON.stringify or a single property instead.',
  },
]

const byId = new Map(GLOSSARY.map((entry) => [entry.id, entry]))
export const getTerm = (id: string) => byId.get(id)

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Every spelling that should be recognised, longest first so "abstract class" wins over "abstract". */
const spellings = GLOSSARY.filter((entry) => entry.auto !== false).flatMap((entry) => [entry.term, ...(entry.aliases ?? [])].map((spelling) => ({ spelling, id: entry.id })))
  .sort((a, b) => b.spelling.length - a.spelling.length)

const lookup = new Map(spellings.map((s) => [s.spelling.toLowerCase(), s.id]))

/** One pattern that matches any spelling as a whole word, case-insensitively. */
export const TERM_PATTERN = new RegExp(`(?<![\\w.])(${spellings.map((s) => escape(s.spelling)).join('|')})(?![\\w(])`, 'gi')

export function termIdOf(spelling: string): string | undefined {
  return lookup.get(spelling.toLowerCase())
}

/** The ids of the glossary terms mentioned in a piece of plain text, in order of appearance. */
export function termsIn(text: string): string[] {
  const found: string[] = []
  for (const match of text.matchAll(TERM_PATTERN)) {
    const id = termIdOf(match[1])
    if (id && !found.includes(id)) found.push(id)
  }
  return found
}
