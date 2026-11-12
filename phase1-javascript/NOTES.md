# Phase 1: JavaScript Notes

A study reference you can come back to. Each lesson has the same shape: what it is, why it exists, the rules with examples, Python comparisons, common mistakes, your own words, and the exercise status.

Status key: not started / taught (explained, exercise pending) / done (exercise completed and understanding checked)

## Folder layout

Every lesson has its own folder. A lesson with several parts keeps all its files in that one folder.

```
phase1-javascript/
  NOTES.md
  lesson1/   lesson1a.js  lesson1b.js  lesson1c.js
  lesson2/   lesson2.js
  lesson3/   lesson3.js
  lesson4/   lesson4a.js  lesson4b.js
  lesson5/   main.js  mathUtils.js  students.js  scratch.js  package.json
  lesson6/   lesson6.js
  lesson7/   lesson7.js
  lesson8/   lesson8a.js  lesson8b.js
  lesson9/   lesson9.js
```

(`lesson4a.js` was originally called `lesson4.js`, and `lesson8a.js` was `lesson8.js`; both were renamed to match `lesson1a`, `lesson1b` and so on.)

Running any file: from `phase1-javascript`, run `node lesson2/lesson2.js`, or `cd` into the lesson folder and run `node lesson2.js`. For `lesson5`, `cd lesson5` first and run `node main.js`. Stop a program that never ends with `Ctrl+C`.

## Lesson plan

Each lesson is roughly 1 hour. At 3-4 hours per week, the whole phase is about 3 weeks.

| # | Lesson | Covers | Status |
|---|--------|--------|--------|
| 0 | Diagnostic | Find out what you already know | skipped (you had forgotten most JS, so we started from Lesson 1) |
| 1 | Variables, types, control flow | let, const, types, template literals, ===, if, loops | done |
| 2 | Functions | Function declarations, arrow functions, default parameters, functions as values, scope | done |
| 3 | Objects and arrays | Properties, nested data, destructuring, spread and rest | done |
| 4 | Array methods | map, filter, find (part 1); some, every, reduce, sort (part 2) | done |
| 5 | Modules | import, export, default vs named | done |
| 6 | Promises | Why async exists, callbacks, Promise, then/catch | done |
| 7 | async/await | async functions, await, try/catch | done |
| 8 | fetch and JSON | JSON.stringify and parse, GET with fetch and response.json() (part 1); status codes, POST, error handling (part 2) | part 1 done; part 2 next |
| 9 | Mini project | Fetch data from a public API and process it in Node | not started |

Deliberately skipped: the browser DOM (document.querySelector and similar). React replaces direct DOM work, so you don't need it now.

---

# Lesson 1: Variables, types, control flow

## Part 1: Variables and types (done, 2026-11-05)

### What a variable is

A name that points to a value. In JavaScript you must declare it with `let` or `const`; a bare `age = 20` is not the normal way.

| | Python | JavaScript |
|---|---|---|
| Assign | `age = 20` | `let age = 20;` or `const age = 20;` |
| Comment | `# note` | `// note` |
| Print | `print(x)` | `console.log(x)` |
| End of statement | newline | semicolon `;` |

### `const` vs `let`

- `const`: the name can never be reassigned. **Use this by default.**
- `let`: the name can be reassigned. Use it only when the value really changes.
- `var`: the old way. Ignore it. Old tutorials use it, modern code does not.

```js
const name = "Rahim";
name = "Aisha";      // TypeError: Assignment to constant variable.

let score = 10;
score = 15;          // fine
```

Why it exists: most values never change. `const` prevents accidental changes and tells every reader "this value is fixed". If you later discover you need to change it, switch it to `let`. The error message shows you exactly where.

### Types

| JavaScript | Example | Python equivalent |
|---|---|---|
| number | `42`, `3.14` | int and float (JS has only one number type) |
| string | `"hello"`, `'hello'` | str |
| boolean | `true`, `false` | bool (lowercase in JS) |
| undefined | a variable declared with no value | roughly "never assigned" |
| null | "intentionally empty" | None |

`typeof` tells you the type of a value:

```js
console.log(typeof 42);      // number
console.log(typeof "hi");    // string
console.log(typeof true);    // boolean
```

### Template literals

JavaScript's version of Python f-strings. Use backticks (the key left of `1`) and `${ }`:

```js
const name = "Rahim";
const score = 82;
console.log(`${name} scored ${score}`);       // Rahim scored 82
console.log(`Next year: ${score + 5}`);       // any expression works inside ${ }
```

### `++` shorthand

`semester++` means `semester = semester + 1`. Also `semester--` for subtracting 1. It is a reassignment, so it does not work on a `const`.

### Common mistakes

- Using `let` for everything. Start with `const`.
- Using normal quotes with `${}`. Template literals need **backticks**, not quotes.
- Reading the error: `TypeError: Assignment to constant variable` plus an arrow pointing to the line means "you tried to reassign a const on this line".

### In my own words

`semester++` caused the error because semester was declared as const, which can't be changed later. Only variables that get reassigned trigger it. Use const when the value isn't changing in the code.

### Exercise status

`lesson1/lesson1a.js` (originally `lesson1.js`): done and reviewed. Improvement noted: `age` and `student` should be `const` since they never change.

---

## Part 2: Comparison and if (done, 2026-11-05)

### Comparison operators

Mostly the same as Python:

```js
5 > 3        // true
5 <= 3       // false
5 !== 3      // true   (Python: !=)
```

### `===` and never `==`

```js
5 === 5        // true
5 === "5"      // false  (number vs string)
5 == "5"       // true   (!)  JavaScript silently converts the types first
```

`==` converts types before comparing, so the results can surprise you. `===` checks the value **and** the type together, like Python's `==`. Rule: use `===` and `!==`, never `==`.

### Logical operators

| Python | JavaScript |
|---|---|
| `and` | `&&` |
| `or` | `\|\|` |
| `not` | `!` |

```js
true && false    // false
true || false    // true
!false           // true
```

### `if` statements

```js
const score = 82;

if (score >= 90) {
  console.log("A");
} else if (score >= 60) {
  console.log("Pass");
} else {
  console.log("Fail");
}
```

Compared with Python:
- Condition goes in **parentheses** `( )`.
- Body goes in **curly braces** `{ }`, not indentation. Still indent, because it makes code readable.
- `else if`, not `elif`.

An if/else-if chain stops at the first true branch. So in the example, when the code reaches `score >= 60`, it already knows `score < 90`. That means a check like `temperature >= 20 && temperature <= 30` after `temperature > 30` could be shortened to `temperature >= 20`.

### Common mistakes

- Writing `=` (assign) when you meant `===` (compare). `if (x = 5)` assigns instead of compares.
- Using `==`.
- Forgetting the braces or parentheses.

### Exercise status

`lesson1/lesson1b.js`: done and reviewed. All four predictions correct. Reminder: test every branch of an if chain, not only the one you expect to run.

---

## Part 3: Loops (done, 2026-11-05)

### What a loop is and why

A loop repeats code. Without loops, printing 1 to 100 would take 100 lines.

### The `for` loop

```js
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
```

Three parts in the parentheses, separated by semicolons:
1. `let i = 1` runs once at the start (the starting value).
2. `i <= 5` is checked before each round. The loop continues while it is true.
3. `i++` runs after each round (add 1).

Python equivalent: `for i in range(1, 6)`. The result is the same, but JavaScript spells out the start, the condition and the step. `i` is `let` because it changes every round.

### Arrays (just enough for now)

An array is JavaScript's list. Lesson 3 covers arrays properly.

```js
const scores = [82, 45, 91];
console.log(scores[0]);       // 82  (counting starts at 0, like Python)
console.log(scores.length);   // 3   (Python: len(scores))
```

### `for...of`

Goes through every item of an array. Python equivalent: `for x in list`.

```js
for (const score of scores) {
  console.log(score);
}
```

`const` works here because each round creates a **new** `score` variable. Nothing is reassigned.

### `while`

Repeats while the condition is true.

```js
let count = 3;
while (count > 0) {
  console.log(count);
  count--;
}
```

Something inside the loop must eventually make the condition false. Otherwise it runs forever. Press `Ctrl+C` in the terminal to stop it.

### Which loop to use

- Known number of rounds: `for`.
- Visiting every item of an array: `for...of`.
- Repeat until something changes and you don't know how many rounds: `while`.

### The accumulator pattern

Used for totals and counts. You start a variable, then update it inside the loop. Because it changes, it must be `let`:

```js
let total = 0;
for (const score of scores) {
  total += score;      // same as total = total + score
}
console.log(total);
```

`+=` adds to the variable and stores the result.

### Common mistakes

- An infinite `while` loop because the variable never changes.
- Off-by-one errors: `i < 5` runs 0 to 4, `i <= 5` runs 0 to 5.
- Declaring the accumulator with `const`, then getting the "Assignment to constant variable" error from Part 1.

### Exercise status

`lesson1/lesson1c.js`: done and reviewed (2026-11-05). Output correct (total 316, 3 passed).
1. `for` loop printing 1 to 5.
2. `for` loop printing only even numbers from 1 to 10 (hint: `%` gives the remainder).
3. `for...of` to total `[82, 45, 91, 60, 38]`. Explain in a comment why you picked `let` or `const`.
4. `for...of` plus `if` to count scores `>= 60`, and print `3 students passed` using a template literal.
5. Optional challenge: do exercise 3 with a `while` loop (not done).

Review notes: the two `for...of` loops could be merged into one. `\n` inside a string is an escape that starts a new line. Match the exact wording requested in a task.

Understanding check questions skipped (user has strong C/C++/Java background).

---

# Lesson 2: Functions (done)

Background note: you know functions from C, C++ and Java. This lesson covers only what is different in JavaScript.

## Three ways to write a function

```js
// 1. Function declaration
function add(a, b) {
  return a + b;
}

// 2. Arrow function stored in a const
const add2 = (a, b) => {
  return a + b;
};

// 3. Arrow function, short form: one expression, "return" is implicit
const add3 = (a, b) => a + b;
const double = n => n * 2;          // one parameter: parentheses optional
const makePoint = (x, y) => ({ x, y }); // returning an object literal: wrap it in ( )
```

- No types anywhere: no return type, no parameter types. JavaScript never checks them.
- With braces `{ }` you must write `return`. Without braces, the expression is returned automatically.
- A function with no `return` gives back `undefined`.
- Arrow functions are the modern default and are what you will see in React and in `map`/`filter`.

## Arrow functions, step by step

Added because arrow functions were confusing. An arrow function is **just a shorter way to write a function**. It does the same job as `function`. All outputs below were run.

**Step 1: the normal function.**

```js
function double1(n) {
  return n * 2;
}
```

**Step 2: the same function as an arrow function.** Replace `function double1(n)` with `const double2 = (n) =>`:

```js
const double2 = (n) => {
  return n * 2;
};
```

The parts: `const name = (parameters) => { body };`. Read `=>` as "gives back" or "goes to". The function is stored in a variable (the recipe is written down and given a name).

**Step 3: shorter still.** If the body is a single expression, remove the braces **and** the word `return`. The value is returned automatically:

```js
const double3 = (n) => n * 2;
```

Calling any of the three, `double1(4)`, `double2(4)` or `double3(4)`, gives `8`.

**Step 4: the parameter list.**

```js
const sayHello = () => "Hello";          // no parameters: empty brackets
const add = (a, b) => a + b;             // two parameters
// sayHello() gives "Hello", add(2, 3) gives 5
```

With exactly one parameter the brackets are optional (`n => n * 2`), but keeping them, `(n) => n * 2`, is clearer and is what these notes use.

**Step 5: why they exist. Arrow functions are short recipes you hand over without naming them.**

```js
setTimeout(() => console.log("Hi after 1 second"), 1000);   // no name needed
[1, 2, 3].map((n) => n * 2);                                // [ 2, 4, 6 ]
```

Compare with Lesson 6 Step 3: instead of writing `function sayHi() {...}` and then `setTimeout(sayHi, 2000)`, you write the recipe inline inside the `setTimeout(...)` brackets. It is the same thing, with less typing.

**Step 6: the trap.** With braces `{ }`, you must write `return`. Without braces, `return` is automatic:

```js
const broken = (n) => { n * 2; };       // braces, no return: gives back undefined
console.log(broken(4));                 // undefined
```

This is the mistake behind two of your earlier exercises (Lesson 4 item 6 and the promise `then` chain).

**Reading an arrow function aloud:** `(n) => n * 2` means "given `n`, give back `n * 2`".

## Default parameters

```js
function greet(name = "friend") {
  return `Hello ${name}`;
}
greet();          // Hello friend
greet("Maruf");   // Hello Maruf
```

## Arguments are not checked (big difference from C++/Java)

- No overloading. One name is one function.
- Missing arguments become `undefined`. Extra arguments are silently ignored.

```js
function f(a, b) { return a + b; }
f(1);          // NaN   (1 + undefined)
f(1, 2, 3);    // 3     (the 3 is ignored)
```

`NaN` means "not a number". This is a common source of silent bugs.

## Functions are values (first-class functions)

A function can be stored in a variable, passed to another function, and returned from one. This is the most important idea in this lesson.

```js
const double = n => n * 2;

function applyTwice(fn, x) {
  return fn(fn(x));
}

applyTwice(double, 5);   // 20
```

A function passed into another function is called a **callback**. In C++ the nearest idea is a function pointer or lambda. JavaScript uses this everywhere:
- `array.map(fn)` and `array.filter(fn)` (Lesson 4)
- `promise.then(fn)` and event handlers (Lessons 6-7, and React)

## Hoisting

Function declarations are available before the line where they appear. Arrow functions in a `const` are not:

```js
sayHi();                      // works
function sayHi() { console.log("hi"); }

sayHello();                   // ReferenceError: Cannot access 'sayHello' before initialization
const sayHello = () => console.log("hello");
```

Practical rule: define a function before you use it, and you will not meet this problem.

## Scope

- `let` and `const` are **block scoped**: they exist only inside the nearest `{ }`.
- A function can read variables from the scope around it. A function that does this and is used later is called a **closure**:

```js
function makeCounter() {
  let count = 0;
  return () => ++count;      // remembers "count" after makeCounter has finished
}
const next = makeCounter();
next();   // 1
next();   // 2
```

You will not write closures often right now, but React hooks depend on this idea.

## Common mistakes

- Writing `return` and then a new line for the value. JavaScript can end the statement at the line break, so the function returns `undefined`.
- Forgetting parentheses around an object literal in a short arrow function.
- Calling `fn` vs passing `fn`: `applyTwice(double, 5)` passes the function, `applyTwice(double(5), 5)` passes the number 10.

## Exercise status

`lesson2/lesson2.js`: done (2026-11-05). Revisit later: retype `applyTwice` from memory to check you are comfortable passing functions as arguments. Fixes made to your code: missing `const` in `for (const number of numbers)` (without it JavaScript silently creates a global variable), and `>` changed to `>=` so that a score of exactly 60 passes.
1. `average(numbers)` as a function declaration. It returns the average of an array, using a loop.
2. `isPassing(score, threshold = 60)` as an arrow function, returning true or false. Test it with and without the second argument.
3. `applyTwice(fn, x)` as above. Test it with `double`, then with an arrow function you write inline, like `applyTwice(n => n + 3, 10)`.
4. Predict, then run: `f(1)` and `f(1, 2, 3)` from the "arguments are not checked" section. Write your predictions in a comment first.

---

# Lesson 3: Objects and arrays (done)

Background note: you know arrays and structs/classes from C, C++ and Java. JavaScript objects and arrays are much looser, and the syntax below is used in nearly all React code.

## Objects

An object is a collection of key-value pairs. No class is needed; you write one directly (an "object literal"):

```js
const student = { name: "Aisha", score: 82, tags: ["ml", "python"] };

student.name;            // "Aisha"      (dot access)
student["name"];         // "Aisha"      (bracket access, key can be a variable)
student.score = 90;      // change a value
student.age = 21;        // add a new property, no declaration needed
delete student.age;      // remove it
student.address;         // undefined    (missing property: no error)
```

- Nested data is normal: `student.address.city`. If `address` is `undefined`, that line throws `TypeError: Cannot read properties of undefined`. The safe form is optional chaining: `student.address?.city`, which gives `undefined` instead of an error.
- `Object.keys(obj)`, `Object.values(obj)` and `Object.entries(obj)` give arrays of the keys, values, or [key, value] pairs.
- Objects like this are almost exactly JSON, which is how JavaScript and Python backends exchange data (Lesson 8).

## `const` does not freeze the contents

This resolves the question from Lesson 1. `const` stops the **name** being reassigned. It does not stop the **contents** changing:

```js
const student = { name: "Aisha" };
student.name = "Mina";          // allowed, the object is modified
student = { name: "Mina" };     // TypeError: Assignment to constant variable.
```

## Arrays

A dynamic list, like `ArrayList` or `std::vector`, but it can hold mixed types:

```js
const scores = [82, 45, 91];
scores.push(60);         // add to the end
scores.pop();            // remove and return the last item
scores.length;           // 3
scores[0];               // 82
scores.at(-1);           // 91, negative index counts from the end (like Python)
scores[10];              // undefined, an out-of-range read does not throw
```

## Assignment copies the reference, not the value

```js
const a = [1, 2, 3];
const b = a;
b.push(4);
console.log(a);   // [1, 2, 3, 4]   a and b are the same array
```

Objects and arrays behave like references in Java. To copy, use spread (below).

## Destructuring

Pull values out of objects and arrays into variables in one line.

```js
const { name, score } = student;          // by property name
const { name: studentName } = student;    // rename while extracting
const { age = 18 } = student;             // default if the property is missing
const [first, second] = scores;           // by position
```

It also works in function parameters, which is how React components receive props:

```js
const describe = ({ name, score }) => `${name}: ${score}`;
describe(student);    // "Aisha: 82"
```

## Spread `...` and rest `...`

The same three dots do two jobs.

**Spread** expands an object or array into a new one. Use it to copy and to make changed copies:

```js
const copy = [...scores];                       // new array with the same items
const extended = [...scores, 100];              // new array with one more item
const updated = { ...student, score: 70 };      // new object, score replaced
const merged = { ...a, ...b };                  // later keys win
```

`updated` is a new object, so `student` is unchanged. This "copy instead of modify" style is how React state updates work in Phase 2.

Spread makes a **shallow** copy: nested arrays and objects are still shared with the original.

**Rest** collects the remaining items:

```js
const [head, ...others] = [1, 2, 3, 4];      // head = 1, others = [2, 3, 4]
const { name, ...remaining } = student;       // remaining has every property except name
function sum(...nums) {                        // nums is an array of all arguments
  let total = 0;
  for (const n of nums) total += n;
  return total;
}
sum(1, 2, 3, 4);   // 10
```

## Destructuring and spread, step by step

Added after the first explanation was too fast.

### Destructuring: why

Without it, pulling values out of an object takes one line each:

```js
const student = { name: "Aisha", score: 82 };
const name = student.name;
const score = student.score;
```

Destructuring is a shortcut for exactly those lines:

```js
const { name, score } = student;
```

Read it as: "create variables called `name` and `score`, and fill them from `student`." The `{ }` on the left is a **pattern**, not a new object. The names must match the property names, and order doesn't matter.

```js
const { score } = student;                 // take only what you need
const { name: studentName } = student;     // rename (the colon means "rename", not a type)
const { age = 18 } = student;              // default used when the property is missing
```

Arrays are matched by **position**, and you choose the names:

```js
const [first, second] = scores;     // first = scores[0], second = scores[1]
```

(Python comparison: `a, b = pair` is the array form. Python has no direct form for dictionaries.)

In function parameters it saves the repeated `student.`:

```js
const describe = ({ name, score }) => `${name}: ${score}`;
```

The function still receives one object. React components receive all their inputs as one `props` object and destructure it the same way.

### Spread: why

`const b = a` points at the same array, so it is not a copy. Spread `...` means "unpack everything inside this, right here":

```js
const base = [1, 2, 3];
const more = [...base, 4];     // [...base, 4] becomes [1, 2, 3, 4], a NEW array
```

For objects, a later key overwrites an earlier one:

```js
const updated = { ...student, score: 70 };   // { name: "Aisha", score: 82, score: 70 } -> score is 70
```

`student` is unchanged. Order matters: `{ score: 70, ...student }` puts the old score back, because `student` comes later.

(Python comparison: `[*base, 4]` and `{**student, "score": 70}`.)

### One rule for the three dots

- Where you **write a value** (inside the `[ ]` or `{ }` you are building): `...` **spreads** (expands).
- Where you **receive** values (a parameter list, or the left of `=`): `...` **collects** the rest.

### Rest parameters (exercise item 6)

Explained from scratch because the first version assumed too much.

**The problem.** A normal function has a fixed number of parameters. `function add(a, b)` adds exactly two numbers. You cannot write a parameter for every possible count.

**Solution 1, which you already know:** pass an array, `sumArray([1, 2, 3, 4])`. The caller has to wrap the values in `[ ]`.

**Solution 2, a rest parameter:** the caller just lists the values, `sum(1, 2, 3, 4)`. You write three dots before the parameter name:

```js
function sum(...nums) { ... }
```

`...nums` means "gather every value the caller passed into one array called `nums`". For `sum(1, 2, 3, 4)`, `nums` is `[1, 2, 3, 4]` inside the function. It is an ordinary array, so `for...of`, `.length` and the accumulator pattern all work.

Normal parameters can come first. The rest parameter must be **last**:

```js
function f(first, ...others) {
  console.log(first);    // 1
  console.log(others);   // [ 2, 3 ]
}
f(1, 2, 3);
```

**Answer to exercise item 6:**

```js
function sum(...nums) {
  let total = 0;
  for (const n of nums) {
    total += n;
  }
  return total;
}

console.log(sum(1, 2, 3, 4));   // 10
console.log(sum(5));            // 5
console.log(sum());             // 0 (nums is an empty array)
```

The loop is identical to `average` in Lesson 2. The only difference is how the caller passes the values: `sum(1, 2, 3, 4)` instead of `average([1, 2, 3, 4])`.

**Rest vs spread.** Both are `...`, opposite directions. Rest (in a parameter list) gathers separate values **into** an array. Spread (in a call or array) expands an array **into** separate values: `sum(...[1, 2, 3])` is the same as `sum(1, 2, 3)`.

### Warm-up exercises (predict, then run)

```js
// A
const p = { x: 1, y: 2, z: 3 };
const { x, z } = p;
console.log(x, z);

// B
const nums = [10, 20, 30];
const [a, b] = nums;
console.log(a, b);

// C
const base = [1, 2];
const more = [...base, 3];
console.log(base, more);

// D
const o = { a: 1, b: 2 };
const o2 = { ...o, b: 99, c: 3 };
console.log(o, o2);
```

Status: done (2026-11-06). B, C and D correct. In A the user wrote `{ x, y: z }` (rename `y` to `z`) instead of `{ x, z }`, which prints `1 2` instead of `1 3`. The colon renames: the name before it must exist in the object.

## Printing an object: `console.log(obj)` vs `${obj}`

```js
const student = { name: "Aisha", score: 82 };

console.log(student);               // { name: 'Aisha', score: 82 }
console.log(`${student}`);          // [object Object]
console.log(JSON.stringify(student));   // {"name":"Aisha","score":82}
console.log(`${[1, 2, 3]}`);        // 1,2,3
console.log("score is", student);   // score is { name: 'Aisha', score: 82 }
console.log(`name is ${student.name}`); // name is Aisha
```

- `console.log(obj)` is a debugging tool. Node formats the object for you so you can inspect it. It is not turning the object into a string first.
- A template literal needs a **string**, so JavaScript converts the object to one. The default conversion for any plain object is the useless text `[object Object]`. (Arrays convert by joining their items with commas.)
- To put a whole object into text, use `JSON.stringify(obj)`. To show one value, use `${student.name}`.
- Seeing `[object Object]` in output almost always means "an object was converted to a string by mistake". It is a common bug in React pages too.
- Python comparison: `print(obj)` and `f"{obj}"` both call the object's string conversion, so they match. In JavaScript, `console.log` is special, which is why they differ.

## Common mistakes

- Thinking `const` makes an object or array unchangeable.
- Putting a whole object inside a template literal and getting `[object Object]`.
- `const b = a` and expecting a copy.
- Reading a property of something that is `undefined` (use `?.` or check first).
- Mixing up `{ }` destructuring (by name) with `[ ]` destructuring (by position).

## Exercise status

`lesson3/lesson3.js`: done (2026-11-06). Rest parameters were new to you, so revisit later: retype `sum(...nums)` from memory to check you can.
- Item 1: prints the last student's name and the tag. Correct.
- Item 2: correct.
- Item 3: copy with `score: 70` is correct, and the original is printed to show it is unchanged.
- Item 4: `push` works on a `const` array because `const` only stops the name being reassigned.
- Item 5: works (it returns more than asked, it also includes `tags`, which is fine).
- Item 6: `sum(...nums)` returns 10, 5 and 0 for `sum(1,2,3,4)`, `sum(5)` and `sum()`.

Use this data:

```js
const students = [
  { name: "Aisha", score: 82, tags: ["ml", "python"] },
  { name: "Rahim", score: 45, tags: ["web"] },
  { name: "Mina", score: 91, tags: ["ml", "js", "react"] },
];
```

1. Print the second tag of the third student, and the name of the last student using `.at(-1)`.
2. In one line, destructure `name` and `score` from `students[0]` and print them in a template literal.
3. Make a copy of `students[1]` with `score` changed to 70 using spread. Print both objects to prove the original did not change.
4. Add a new student to the end of `students` using `push`. In a comment, explain why this works even though `students` is `const`.
5. Write `describe = ({ name, score }) => ...` that destructures in the parameter list and returns `"Aisha: 82"`. Call it on the first student.
6. Write `sum(...nums)` using a rest parameter. Call `sum(1, 2, 3, 4)`.

---

# Lesson 4: Array methods

## Part 1: map, filter, find (done, 2026-11-06)

### What they are and why

These are methods that every array has. Each one takes a **function** (a callback, from Lesson 2) and calls it once for every item. They replace the `for` loop plus an empty array plus `push` that you would otherwise write.

### `map`: transform every item

Returns a **new array of the same length**, where each item is whatever the callback returns. The original is not changed.

```js
const scores = [82, 45, 91];

// with a loop
const curved = [];
for (const s of scores) {
  curved.push(s + 5);
}

// with map
const curved2 = scores.map((s) => s + 5);   // [87, 50, 96]
```

The name `s` is yours to choose. It is the parameter that receives each item in turn. (Python comparison: `[s + 5 for s in scores]`.)

With objects:

```js
const names = students.map((student) => student.name);        // ["Aisha", "Rahim", ...]
const names2 = students.map(({ name }) => name);              // same, with destructuring
```

### `filter`: keep some items

Returns a **new array** containing only the items for which the callback returns `true`.

```js
const passing = scores.filter((s) => s >= 60);      // [82, 91]
```

(Python comparison: `[s for s in scores if s >= 60]`.)

### `find`: get the first match

Returns the **first item** for which the callback returns `true`, or `undefined` if there is none. It returns the item itself, not an array.

```js
const mina = students.find((s) => s.name === "Mina");    // the Mina object
const nobody = students.find((s) => s.name === "Zed");   // undefined
```

### Chaining

`map` and `filter` return arrays, so you can call another method straight on the result:

```js
const passingNames = students
  .filter((s) => s.score >= 60)
  .map((s) => s.name);
```

Read it top to bottom: "keep the students who passed, then take their names."

### Handy: `includes`

`array.includes(value)` returns `true` or `false`: `["ml", "js"].includes("ml")` is `true`. It is useful inside a `filter` callback.

### Why this matters for React

In React, showing a list on the page is `items.map((item) => ...)`. You will use `map` constantly in Phase 2.

### Common mistakes

- **Braces without `return`.** `scores.map((s) => { s * 2 })` gives `[undefined, undefined, undefined]`, because a function body in `{ }` needs an explicit `return`. Either write `(s) => s * 2` or `(s) => { return s * 2; }`.
- Expecting `map` or `filter` to change the original array. They never do; they return a new one.
- Expecting `find` to return an array. It returns one item or `undefined`.
- Using `map` when you do not use the returned array. Use a `for...of` loop or `forEach` for that.

### Exercise status

`lesson4/lesson4a.js` (renamed from `lesson4.js`): done (2026-11-06). Revisit later: retype the filter-then-map chain from item 5 from memory. Verified with a fake high scorer without the `ml` tag, who is correctly excluded. Review:
- Items 1 to 4: correct.
- Item 5: the `ml` tag condition was missing at first. Second attempt chained `filter`, `map`, then `find(st => st.includes("ml"))`. That fails because each chain step receives the output of the previous step: after `map(st => st.name)` the items are plain name strings, so `tags` no longer exists, and `find` returns only one item anyway. Fix: do both checks in one `filter` callback while the items are still objects (`score >= 60 && tags.includes("ml")`), then `map` last to get the names. Rule: filter first on the full objects, map last to reshape.
- Item 6: first prediction was wrong; second attempt correct (five `undefined` values). You predicted the doubled scores, but a function body in `{ }` without `return` gives back `undefined`, so `map` returns an array of `undefined`. The doubling itself was understood.
- Style: JavaScript uses camelCase (`passedMl`), not Python's snake_case (`passed_ml`).

Use this data:

```js
const scores = [82, 45, 91, 60, 38];
const students = [
  { name: "Aisha", score: 82, tags: ["ml", "python"] },
  { name: "Rahim", score: 45, tags: ["web"] },
  { name: "Mina", score: 91, tags: ["ml", "js", "react"] },
  { name: "Noman", score: 99, tags: ["ml", "java", "python"] },
];
```

1. `map`: a new array where every score has 5 added. Print it and the original.
2. `filter`: only the scores that are 60 or more.
3. `map` on `students`: an array of just the names.
4. `find`: the student named `"Mina"`. Then `find` a name that does not exist and predict what you get.
5. Chain `filter` and `map`: the names of students who scored 60 or more **and** have the tag `"ml"`.
6. Predict the output without running it, then check: `console.log(scores.map((s) => { s * 2 }));`

## Part 2: some, every, reduce, sort (done, 2026-11-06)

All outputs below were run in Node to check them.

### `some` and `every`: yes/no questions about an array

Both return a boolean. (Python comparison: `any(...)` and `all(...)`.)

```js
const scores = [82, 45, 91, 60, 38];

scores.some((s) => s >= 90);     // true   (at least one item passes the test)
scores.every((s) => s >= 60);    // false  (not every item passes)
```

On an empty array, `some` is `false` and `every` is `true`.

### `reduce`: combine all items into ONE value

`reduce` is the accumulator loop from Lesson 1 Part 3, written as a method. Compare:

```js
// with a loop
let total = 0;
for (const s of scores) {
  total = total + s;
}

// with reduce
const total2 = scores.reduce((total, s) => total + s, 0);     // 316
```

The callback receives two things: the **accumulator** (the running result so far) and the **current item**. Whatever the callback returns becomes the accumulator for the next round. The second argument to `reduce` (`0` here) is the **starting value** of the accumulator.

Walk-through of `[82, 45, 91]` with start `0`:

| round | accumulator in | item | callback returns |
|---|---|---|---|
| 1 | 0 | 82 | 82 |
| 2 | 82 | 45 | 127 |
| 3 | 127 | 91 | 218 |

The final result is 218.

More examples:

```js
scores.reduce((max, s) => (s > max ? s : max), scores[0]);          // 91, the largest
scores.reduce((count, s) => (s >= 60 ? count + 1 : count), 0);      // 3, how many passed
```

`condition ? a : b` is the ternary operator: it gives `a` if the condition is true and `b` otherwise. You will see it in React often.

Rules: always pass the starting value, and remember that braces in the callback need an explicit `return`.

### `sort`: two traps

**Trap 1: `sort` changes the original array** and also returns it.

```js
const copy = [3, 1, 2];
copy.sort();           // copy itself is now [1, 2, 3]
```

To keep the original, copy first with spread: `[...scores].sort(...)`. Modern Node also has `toSorted(...)`, which returns a new array and leaves the original alone.

**Trap 2: the default sort compares items as text.**

```js
[10, 9, 1].sort();                     // [ 1, 10, 9 ]   wrong for numbers
[10, 9, 1].sort((a, b) => a - b);      // [ 1, 9, 10 ]   ascending
[10, 9, 1].sort((a, b) => b - a);      // [ 10, 9, 1 ]   descending
```

The compare function receives two items, `a` and `b`. If it returns a negative number, `a` goes first; if positive, `b` goes first. So `a - b` sorts ascending.

Sorting objects by a property:

```js
[...students].sort((a, b) => b.score - a.score).map((s) => s.name);   // highest score first
```

### Common mistakes

- Calling `reduce` without a starting value.
- Forgetting `return` when the callback has braces.
- Calling `.sort()` on numbers with no compare function.
- Forgetting that `sort` modifies the original array.

### Exercise status

`lesson4/lesson4b.js`: done (2026-11-06). Review notes:
- Item 1: an `if` that prints only when the result is true hides a `false` result. Print the boolean itself so both answers always show.
- Item 3: `reduce` without a starting value works (it starts from the first item) but throws on an empty array.
- Item 6: output `[ 100, 25, 3 ]` is right, and it shows the trap: the default sort compares as text, so it is not numerically sorted.
- Style: avoid naming a callback parameter the same as an outer variable (`total` inside `const total = ...reduce(...)`); it works by shadowing but reads badly.

Exercise items (same `scores` and `students` data as part 1):

1. `some`: is there any score above 90? `every`: did everybody score at least 40? Print both.
2. `reduce`: the total of `scores`, then the average (divide by `scores.length`).
3. `reduce`: the highest score in `scores`, without using `Math.max`.
4. `sort`: the `scores` in descending order, **without changing the original** `scores`. Print both.
5. `sort` the `students` by score from highest to lowest and print only their names.
6. Predict, then check: `console.log([100, 25, 3].sort());`

---

# Lesson 5: Modules (import / export) (done, 2026-11-06)

## What a module is and why

A module is just a file. Every file keeps its own variables private: a `const` at the top of one file cannot be seen from another file. To share something you **export** it from one file, and **import** it in the file that needs it.

Why: it lets you split a program into small files, each doing one job, instead of one huge file. React projects are made of hundreds of small files connected this way, so every React file starts with imports.

## Named exports

A file can export many things, each by name:

```js
// mathUtils.js
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}
```

Import them with **braces**. The names must match exactly:

```js
// main.js
import { add, PI } from "./mathUtils.js";

console.log(add(2, 3));   // 5
```

Rename on import with `as`:

```js
import { PI as pi } from "./mathUtils.js";
```

Import everything under one name with `* as`:

```js
import * as math from "./mathUtils.js";
math.add(1, 1);           // 2
```

## Default export

A file can have **one** default export. Import it **without braces**, and you choose the name:

```js
// greet.js
export default function greet(name) {
  return `Hello ${name}`;
}

// main.js
import greet from "./greet.js";          // could be called anything: import hello from ...
```

You can mix both in one import: `import greet, { add, PI } from "./mathUtils.js";`

When to use which: React components are usually default exports (one component per file). Helper functions and constants are usually named exports.

## `export` vs `export default`: the difference

"Export" on its own means a **named** export. The two kinds differ in four ways:

| | Named export | Default export |
|---|---|---|
| Written as | `export const PI = 3` or `export function add() {}` | `export default students;` |
| How many per file | as many as you like | at most one |
| Imported with | braces: `import { add } from "./x.js"` | no braces: `import students from "./x.js"` |
| Name in the importing file | must match, or rename with `as` | any name you like |

Think of a file as a box. Named exports are **labelled items**: you ask for them by label. The default export is **the one main thing** the file is about, so you just ask for "the box's main item" and call it whatever you like.

Same file, both kinds (this is your `students.js`):

```js
export default students;          // the main thing
export function getPassing() {}   // an extra helper
```

```js
import students, { getPassing } from "./students.js";
//     ^ default, no braces   ^ named, braces
```

Why both exist: a file that is "about one thing" (a React component) uses a default export. A file full of helpers or constants uses named exports, because the names document what is available and the importing side cannot misspell them silently. Many teams prefer named exports everywhere, because with a default export every file can rename it differently.

Item 6 error: `import { students } from "./students.js"` fails with `The requested module './students.js' does not provide an export named 'students'`, because braces ask for a **named** export and `students` is the **default**.

## Paths

- `"./mathUtils.js"` means "the file in the same folder". `"../x.js"` means one folder up. The `./` or `../` is required for your own files.
- In plain Node you must write the `.js` extension. I tested leaving it out and got `ERR_MODULE_NOT_FOUND`. Tools like Vite (used for React) let you leave it out, but keep it in Node.

## Running modules in Node

Node has two module systems:
- **ES modules** (`import` / `export`): the modern standard, used by browsers, Vite and React. This is what we use.
- **CommonJS** (`require(...)` / `module.exports = ...`): the older Node style. You will see it in old tutorials and some Node code. Recognise it, but write `import`.

In your Node version (v24), a `.js` file containing `import` is detected as an ES module automatically. To be explicit, the `lesson5/` folder has a `package.json` containing `{ "type": "module" }`, which is also how Vite projects are set up.

Run the entry file from inside the folder: `cd lesson5` then `node main.js`. Only run the file that imports the others (`main.js`); `mathUtils.js` and `students.js` have nothing to run on their own.

## Common mistakes

- Forgetting the `./` in the path, or the `.js` extension in Node.
- Using braces for a default export (`import { greet } from ...`) or leaving them off for a named export. The error says `does not provide an export named ...`.
- Misspelling a name: named imports must match the export exactly.
- Trying to run the module file instead of the file that imports it.

## Exercise status

`lesson5/`: done (2026-11-06): `mathUtils.js`, `students.js`, `main.js`, `scratch.js`. Output: `5 20`, `10`, `[ 'Aisha', 'Mina', 'Noman' ]`. Review notes:
- `getPassing` first returned a single `false` (it used `list.score` on the array), then `[]` (it compared the whole student object to 60). Fixed by filtering on `s.score`. Lesson: in a callback over objects, `s` is the whole object, so look inside it.
- Design note: `getPassing` now returns names (the `map` is inside it), but the task said it should return the passing **students**, with the `map` done in `main.js`. A function named `getPassing` that returns names is misleading. It works, so it was left as written.
- Item 6 error confirmed in `scratch.js`. The prediction was not written down before running; do that next time.
- Formatting changed: imports moved to the top of `main.js` (standard convention, behaviour identical).

The exercise items were:

1. `mathUtils.js`: export `add(a, b)`, `multiply(a, b)` and a constant `TAX_RATE = 0.1`, all as named exports.
2. `main.js`: import `add` and `multiply` with braces; print `add(2, 3)` and `multiply(4, 5)`.
3. `main.js`: import `TAX_RATE` renamed to `taxRate`; print `100 * taxRate`.
4. `students.js`: `export default` the students array, and export a named function `getPassing(list)` that returns the students with `score >= 60`.
5. `main.js`: import the default array and `getPassing`; print the names of the passing students.
6. Predict, then check in a scratch file: what happens with `import { students } from "./students.js"` when `students` is the default export?

---

# Lesson 6: Promises (done, 2026-11-08)

All outputs below were run in Node. This is the first idea in the course with no direct C++/Java equivalent, so it is explained from the problem upward.

## Before promises: three small steps, from zero

Promises felt confusing because they stand on an idea that was not practised yet: **a function can be handed to someone else, who runs it later**. These three steps build that idea one piece at a time. All outputs were run in Node.

### Step 1: defining a function vs running it

```js
function sayHi() {
  console.log("Hi!");
}

console.log("A");
sayHi();              // the ( ) means "run it now"
console.log("B");
```

Output: `A`, `Hi!`, `B`.

`function sayHi() {...}` only writes the recipe down. Nothing happens. `sayHi()`, with the brackets, is what actually cooks the recipe. **`sayHi` without brackets is the recipe itself. `sayHi()` with brackets is "run it now".**

### Step 2: a recipe can be handed to someone else

```js
const myRecipe = sayHi;     // no brackets: copy the recipe, do NOT run it
console.log("before");
myRecipe();                 // now run it: prints Hi!
```

```js
function doThreeTimes(recipe) {
  recipe();                 // whoever receives the recipe runs it
  recipe();
  recipe();
}

doThreeTimes(sayHi);        // no brackets after sayHi: hand over the recipe
```

Output: `Hi!` three times.

The mistake to know about:

```js
doThreeTimes(sayHi());      // brackets: sayHi runs NOW and prints Hi! once,
                            // then hands over its result (undefined), not the recipe
```

Output: `Hi!`, then `Error: recipe is not a function`. A function that is handed to another function to be run later is called a **callback**.

### Step 3: someone else decides WHEN to run your recipe

```js
console.log("A");
setTimeout(sayHi, 2000);    // "timer, run sayHi in 2 seconds" (recipe handed over, not run)
console.log("B");
```

Output: `A`, `B` immediately, and `Hi!` two seconds later.

`setTimeout` is just `doThreeTimes` with a clock: it receives a recipe and runs it later instead of now. Your program does not stop and wait; it carries on to the next line. This is the idea behind everything in Lesson 6: you hand over a recipe, and the result arrives later.

Practice file: `lesson6/basics.js`. Status (2026-11-08): Steps 1 to 3 answered correctly in your own words. Step 4 (arrow functions): a, c and d correct. b first printed instead of returning (see below), then was fixed to return; only a small typo in the string remained (`"hi"` instead of `"Hi "`). Basics done.

### Printing vs returning

```js
const greetPrints = (name) => console.log("Hi", name);   // shows text on screen, gives back undefined
const greetReturns = (name) => "Hi " + name;             // gives the text back to the caller

console.log(greetPrints("Maruf"));    // Hi Maruf   then   undefined
console.log(greetReturns("Maruf"));   // Hi Maruf
```

**Printing shows something on the screen. Returning hands a value back to whoever called the function.** A function that only prints cannot be used inside other code (`.map`, `.then`, `reduce`), because it gives nothing back. Step 4 b asked for a function that returns.

## The problem: some things take time

Some operations are slow: a network request, reading a big file, a database query, a timer. JavaScript runs **one thing at a time**. If it stood and waited for a slow operation, everything else (a web page, a server handling other users) would freeze.

So JavaScript does this instead: it **starts** the slow operation, **moves on** to the next line, and the result arrives **later**.

```js
console.log("1: start");
setTimeout(() => console.log("4: after 1 second"), 1000);   // start a timer, do not wait
console.log("2: end of the script");
```

Output order: `1: start`, `2: end of the script`, then 1 second later `4: after 1 second`. The code after `setTimeout` does **not** wait for it. Even `setTimeout(fn, 0)` runs after the lines below it.

`setTimeout(fn, ms)` calls `fn` after `ms` milliseconds. It is a simple stand-in for any slow operation.

The restaurant picture: you order food and get a buzzer. You do not stand at the kitchen door; you sit down, and the buzzer rings when the food is ready. A promise is the buzzer.

## The old way: callbacks

You pass a function to run when the slow thing finishes (like the `setTimeout` above). It works, but doing several slow steps in a row means nesting callbacks inside callbacks, which gets very hard to read. Promises were added to fix that.

## What a promise is

A **promise** is an object that stands for a value that is **not available yet**. It is always in one of three states:

| State | Meaning |
|---|---|
| pending | still working |
| fulfilled | finished successfully, has a value |
| rejected | failed, has an error |

```js
const p = getScore(false);
console.log(p);                       // Promise { <pending> }   (printed right away)
// ...300 ms later...
console.log(p);                       // Promise { 82 }
```

A promise changes state **once** and then never again.

## Step by step: how `resolve` and `.then` work together

Added because the first explanation was too fast. All three experiments were run, with the time each line printed.

**The model: a promise is a box that you return right away.** Inside the box, someone will press a button when the work is done. That button is `resolve`. `.then(fn)` means "when the button is pressed, run `fn`".

### Experiment 1: press the button yourself

```js
let pressDone;
const p = new Promise((resolve) => {
  pressDone = resolve;              // keep the button so we can press it later
});
p.then((value) => console.log("1c. then ran, got:", value));
console.log("1a. promise made, nothing pressed yet");

setTimeout(() => {
  console.log("1b. pressing the button now");
  pressDone("hello");               // press the button, passing the result
}, 1000);
```

Output, with the time of each line:

```
[0.1s] 1a. promise made, nothing pressed yet
[1.1s] 1b. pressing the button now
[1.1s] 1c. then ran, got: hello
```

The `.then` function does **not** run when you write it. It runs only when the button is pressed. Whatever you pass into `resolve(...)` arrives as the parameter of the `.then` function.

### Experiment 2: `wait` is the same thing, with a timer pressing the button

```js
function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);       // after ms milliseconds, press the button
  });
}

console.log("2a. before wait");
wait(2000).then(() => console.log("2c. 2 seconds passed"));
console.log("2b. right after calling wait, no waiting happened");
```

Output: `2a`, then `2b` immediately, and then `2c` two seconds later.

`setTimeout(resolve, ms)` reads as: "after `ms` milliseconds, call `resolve`", which is pressing the button. In Lesson 2 you learned that a function can be passed around like a value. Here `resolve` is a function we hand to `setTimeout`.

### Experiment 3: why the broken version fails

```js
function brokenWait(ms) {
  setTimeout(() => ms);             // no return, no promise, no resolve
}
console.log(brokenWait(1000));      // undefined
```

`brokenWait(1000)` hands back `undefined`, not a box. `undefined.then(...)` crashes with `Cannot read properties of undefined (reading 'then')`.

### The recipe for any function that returns a promise

1. `return new Promise((resolve, reject) => { ... })`: hand back the box.
2. Inside, start the slow work.
3. When the work succeeds, call `resolve(value)`. If it fails, call `reject(error)`.

Everything in the rest of the course (`fetch`, calls to your FastAPI backend) returns a promise made this way. You will mostly use `.then` or `await` on promises that others made, and the box idea is the same.

## Creating a promise (to understand how they work)

You will mostly receive promises from other code (`fetch` in Lesson 8). But creating one shows what is happening:

```js
function getScore(shouldFail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Could not load score"));
      } else {
        resolve(82);
      }
    }, 300);
  });
}
```

- `new Promise((resolve, reject) => { ... })`: you give it a function. JavaScript passes that function **two functions**.
- Call `resolve(value)` when it worked. The promise becomes fulfilled with `value`.
- Call `reject(error)` when it failed. The promise becomes rejected with `error`. Use `new Error("message")` for the error.

A reusable "wait" helper (you will write this one):

```js
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
```

## Using a promise: `then`, `catch`, `finally`

```js
getScore(false).then((s) => console.log("then got:", s));        // then got: 82

getScore(true)
  .then((s) => console.log("never printed", s))
  .catch((e) => console.log("catch got:", e.message))            // catch got: Could not load score
  .finally(() => console.log("finally runs either way"));
```

- `.then(fn)`: runs `fn` with the value when the promise is **fulfilled**.
- `.catch(fn)`: runs `fn` with the error when the promise is **rejected**.
- `.finally(fn)`: runs `fn` in both cases (for cleanup, such as hiding a loading spinner).

## Chaining

`.then(...)` itself returns a **new promise**. Whatever your callback **returns** becomes the value for the next `.then`:

```js
wait(500)
  .then(() => 10)
  .then((n) => n * 2)
  .then((n) => console.log("chain result:", n));      // chain result: 20
```

One `.catch` at the end handles a failure in **any** step above it. This is the fix for nested callbacks: a flat list of steps.

## Common mistakes

- **Expecting the code after `.then(...)` to wait.** It does not. The lines below run first, and the `.then` callback runs later.
- **Forgetting `return` in a `.then` with braces.** Same trap as Lesson 4: with `{ }` you need `return`. Verified:

  ```js
  wait(600)
    .then(() => 10)
    .then((n) => { n * 2; })                          // no return
    .then((n) => console.log("next then gets:", n));  // next then gets: undefined
  ```

- **No `.catch`.** If a promise is rejected and nothing handles it, Node prints the error and stops the program. Always handle the failure case.
- **Treating the promise as the value.** `const score = getScore(false);` gives you a pending promise, not 82. You must use `.then` (or `await`, next lesson) to get the value.

## Why this matters for the roadmap

- `fetch(...)` (Lesson 8) returns a promise.
- React's data loading, calls from React to FastAPI, and calls to LLM APIs all return promises.
- Lesson 7 (`async/await`) is just a cleaner way to write exactly this.

## Exercise status

`lesson6/lesson6.js`: done (2026-11-08). Items 1 and 2 correct (item 2 written from memory). Item 3 review:
- `if (matched)` tests a function that is never called, so it is always true (the same `sayHi` vs `sayHi()` idea from the basics). "Zed" wrongly printed "Student found".
- The `matched` callback used braces without `return` (third time this trap appeared), and searched `students.name` on the array instead of looking at each student. The Lesson 4 `find` does this job: `students.find((s) => s.name === name)`.
- `setTimeout(resolve, 500)` presses the button with no value. The student has to travel through the button: `resolve(student)`. Written directly in `setTimeout(...)` it would press immediately (brackets mean run now), so wrap it: `setTimeout(() => resolve(student), 500)`.
- The failure branch did `console.error(reject)`, which prints the button instead of pressing it. It must be `reject(new Error("Student not found"))`.
- `.then(() => ...)` ignored the value. It should receive the student: `.then((student) => ...)`, and `.catch((error) => console.log(error.message))`.
- Structure to aim for: `new Promise` containing a `setTimeout` of 500 ms, which does the `find`, then calls `resolve(student)` or `reject(new Error(...))`.

Item 3 now works (2026-11-08): output is the Mina object and `Student not found` at 0.5 s. The last fix was pressing the failure button with brackets and a value: `reject(new Error("Student not found"))`, not `reject;`. Pressing a button means calling it: `resolve(value)` or `reject(error)`.

Item 4, first attempt: `getStudent("Aisha").map(...)` failed with `aisha.map is not a function`. The variable holds a **promise** (printed as `Promise { <pending> }`), not the student, and `.map` is an array method. To use a value inside a promise, chain `.then`. Each `.then` receives what the previous one returned, so every step must give a value back (braces need `return`). Shape: `.then((student) => score).then((score) => score + 5).then((result) => console.log(result))`, which should print `87`. A crash on line 68 also stopped the timers of items 2 and 3 from ever firing, because the error happens before any timer finishes.

Item 4 done (2026-11-08): `getStudent("Aisha").then((student) => student.score).then((score) => score + 5).then((result) => console.log(result))` prints `87` at 0.5 s. Tip for later: end a real chain with `.catch(...)`, because an unhandled rejection stops the program.

Item 5 done: the prediction was "it will throw an error", which was close but not right. The next `.then` receives `undefined`, and there is no error by itself. All verified by running: printing it shows `undefined`, `result + 1` gives `NaN`, and only reading a property of it (`result.toFixed(1)`) throws `Cannot read properties of undefined`. A missing `return` therefore usually fails silently, which is why it is worth watching for.

All five items done. Revisit later: write `wait` and `getStudent` again from memory.

### Truthy and falsy: why `if (student)` works

A variable does not have to be `true` or `false` to be used in an `if`. `students.find(...)` gives back **the student object**, or **`undefined`** if nothing matched. `if (student)` then asks "is there something here?"

```js
const found = students.find((st) => st.name === "Mina");   // { name: 'Mina', score: 91 }
const missing = students.find((st) => st.name === "Zed");  // undefined

found === true      // false, found is an object, not the boolean true
if (found) { }      // runs: an object counts as "something" (truthy)
if (missing) { }    // does not run: undefined counts as "nothing" (falsy)
```

**Falsy values** (treated as false inside an `if`): `false`, `0`, `""` (empty text), `null`, `undefined`, and `NaN`. **Everything else is truthy**, including `"hi"`, `1`, and even an empty array `[]` or empty object `{}` (all checked by running them).

Compare with `some`, which really returns `true` or `false`: `students.some((st) => st.name === "Mina")` is `true`.

1. Predict the print order, then run: `console.log("A"); setTimeout(() => console.log("B"), 0); console.log("C");`
2. Write `wait(ms)` that returns a promise resolving after `ms` milliseconds. Use it: `wait(1000).then(() => console.log("1 second passed"))`.
3. Write `getStudent(name)` that returns a promise. After 500 ms it resolves with the matching student from the array, or rejects with `new Error("Student not found")` if none matches. Call it with `"Mina"` (print the object) and `"Zed"` (print only the error message), using `then` and `catch`.
4. Chain: from `getStudent("Aisha")`, take the score, add 5, and print the final number.
5. Predict, then check: if a middle `.then` uses braces and forgets `return`, what does the next `.then` receive? Print it to see.

---

# Lesson 7: async / await (done, 2026-11-09)

All outputs below were run in Node.

## What it is and why

`async` and `await` are a cleaner way to write promise code. The boxes and buttons are exactly the same. The only difference is that the code **reads from top to bottom like normal code**, with no `.then` chain.

The Aisha chain from Lesson 6, side by side:

```js
// Lesson 6 style: .then chain
getStudent("Aisha")
  .then((student) => student.score)
  .then((score) => score + 5)
  .then((result) => console.log(result));

// Lesson 7 style: async / await
async function aishaPlusFive() {
  const student = await getStudent("Aisha");
  const result = student.score + 5;
  console.log(result);
}
aishaPlusFive();
```

Both print `87`.

## The two keywords

**`async` before a function.** It marks the function as one that may need to wait. An async function **always returns a promise** (checked: `typeof five().then` is `function`, even for `async function five() { return 5; }`).

**`await` before a promise.** It means: "pause **this function** here until the box's button is pressed, then give me what was inside."

```js
const student = await getStudent("Aisha");
```

`await getStudent("Aisha")` gives you the same thing the `.then((student) => ...)` callback received: the student object itself, not a box.

`await` can be used only inside an `async` function. (Modern Node and ES modules also allow it at the top level of a file, but inside an `async` function is the rule that always works.)

## Only the async function pauses, not the program

```js
async function pause() {
  console.log("1a. start");
  await wait(1000);
  console.log("1c. 1 second later");
}

pause();
console.log("1b. after calling pause()");
```

Output order: `1a. start`, `1b. after calling pause()`, then a second later `1c. 1 second later`. The function pauses at `await`. The rest of the program carries on. This is the same idea as the print order exercise in Lesson 6 item 1.

## Errors: `try` / `catch`

A rejected promise becomes an error at the `await`. Catch it with `try` / `catch`, which replaces `.catch(...)`:

```js
async function findZed() {
  try {
    const student = await getStudent("Zed");
    console.log("found", student);
  } catch (error) {
    console.log("caught:", error.message);      // caught: Student not found
  }
}
```

If the `try` part fails at any line, JavaScript jumps straight to `catch`, with the error as its parameter.

## Arrow function version

```js
const aishaPlusFive = async () => {
  const student = await getStudent("Aisha");
  console.log(student.score + 5);
};
```

## The trap: forgetting `await`

```js
async function forgot() {
  const student = getStudent("Mina");        // no await
  console.log(student);                       // Promise { <pending> }
  console.log(student.score);                 // undefined
}
```

You get the **box**, not the student. This is the same mistake as `aisha.map` in Lesson 6. If you ever see `Promise { <pending> }` where a value should be, a missing `await` (or `.then`) is the first thing to check.

## Common mistakes

- Forgetting `await` (see above).
- Using `await` in a function that is not `async`.
- Forgetting that code after the function call keeps running while the function waits.
- No `try` / `catch`: a rejected promise that nothing handles stops the program, same as with `.then` and no `.catch`.

## Why this matters for the roadmap

`fetch` (Lesson 8) returns a promise, and almost all real JavaScript for talking to a backend is written as `async` / `await`. In React (Phase 2) and when calling your FastAPI backend (Phase 4), you will write exactly this.

## Exercise status

`lesson7/lesson7.js`: done (2026-11-09). Items 3 and 5 were corrected after review: item 3 now prints `error.message`, and item 5 has the corrected prediction plus a `forgot()` function proving it (`Promise { <pending> }` and `undefined`). The starter has `wait` and `getStudent` already written (from Lesson 6), so the focus is the new syntax. Review so far:
- Item 1: correct, prediction `start`, `after calling pause`, `1 second later` matched the run.
- Item 2: correct (`Mina scored 91`).
- Item 3: `try`/`catch` is right, but `console.error(error)` prints the whole error object with its stack trace. The task asked for only the message, which is `error.message`.
- Item 4: correct (`87`).
- Item 5: prediction was "the variable holds `undefined` and `student.score` gives `NaN`". Without `await` the variable holds the **promise** (`Promise { <pending> }`) and `student.score` is `undefined`. `NaN` would only appear after arithmetic, such as `student.score + 5`. The "missing return gives undefined" idea from Lesson 6 is a different mistake from "missing await gives a box".

1. Write `async function pause()`: print `start`, `await wait(1000)`, then print `1 second later`. Call `pause()` and on the next line print `after calling pause`. Predict the order of the three prints first.
2. Write `async function showScore()` that awaits `getStudent("Mina")` and prints `Mina scored 91`, using a template literal.
3. Write `async function findZed()` with `try` / `catch`: await `getStudent("Zed")`, and print only the error message.
4. Rewrite the Lesson 6 Aisha chain as an `async` function: the score plus 5, printed.
5. Predict, then check: in `showScore`, remove `await`. What does the variable hold, and what does `student.score` give?

---

# Lesson 8: fetch and JSON

## Part 1: JSON and GET requests (done, 2026-11-09)

All outputs below were run in Node against a real public API.

### Why this lesson exists

Your React frontend and your FastAPI backend will be two separate programs, often on different computers. They can only talk by sending **text** over the network. So you need two things:

1. A text format for data: **JSON**.
2. A way to ask another computer for something and wait for the answer: **`fetch`**, which returns a promise, so everything from Lessons 6 and 7 applies.

Reading, with official documentation as a reference:
- MDN, "Using the Fetch API": https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch (covers `response.ok`, `response.json()`, and POST with JSON)
- javascript.info, "JSON methods, toJSON": https://javascript.info/json
- javascript.info, "Fetch": https://javascript.info/fetch
- A free practice API with no sign-up and no key: https://jsonplaceholder.typicode.com/ (resources: posts, comments, albums, photos, todos, users)

### Step 1: JSON

**JSON is text that looks like a JavaScript object.** A network can only carry text, not live JavaScript objects, so objects are turned into text to be sent and back into objects when they arrive.

```js
const student = { name: "Aisha", score: 82, tags: ["ml", "python"] };

const text = JSON.stringify(student);
console.log(text);                 // {"name":"Aisha","score":82,"tags":["ml","python"]}
console.log(typeof text);          // string

const back = JSON.parse(text);
console.log(back);                 // { name: 'Aisha', score: 82, tags: [ 'ml', 'python' ] }
console.log(typeof back);          // object
console.log(back.name);            // Aisha
```

- `JSON.stringify(object)`: object becomes text.
- `JSON.parse(text)`: text becomes an object again.
- Remember the Lesson 3 surprise: `${student}` gave `[object Object]`. `JSON.stringify(student)` is the proper way to turn a whole object into text.
- JSON rules: keys and text values need **double quotes**, and it cannot hold functions.

### Step 2: `fetch`

`fetch(url)` asks another computer for something. It returns a **promise** (a box), so you `await` it:

```js
const box = fetch("https://jsonplaceholder.typicode.com/users/1");
console.log(box);                  // Promise { <pending> }
```

What comes out of the first box is a **Response** object (status, headers, and so on), not the data yet. The data is in a **second box**: `response.json()` also returns a promise, so it needs its own `await`.

```js
async function main() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
  console.log(response.status, response.ok);     // 200 true

  const user = await response.json();            // second await
  console.log(user.name, user.email);            // Leanne Graham Sincere@april.biz
}
main();
```

Why two steps: the first box fills when the reply starts arriving (status and headers). The body can be large and arrives after, so reading it is a separate promise.

A list works the same way and gives an array. `/users` returned 10 users: `users.length` was `10`, and `users.slice(0, 3).map((u) => u.name)` gave `[ 'Leanne Graham', 'Ervin Howell', 'Clementine Bauch' ]`. All of the array methods from Lesson 4 now apply to real data.

### Step 3: a missing item is NOT an error (the big gotcha)

```js
const missing = await fetch("https://jsonplaceholder.typicode.com/users/9999");
console.log(missing.status, missing.ok);       // 404 false
```

A 404 (not found) still counts as "the server answered", so the promise does **not** reject. You must check `response.ok` (or `response.status`) yourself. Only a real network failure rejects. Calling a domain that does not exist threw `TypeError: fetch failed`.

Part 2 covers handling this properly, and POST requests.

### Common mistakes

- Forgetting the second `await`: `const user = response.json();` makes `user` a promise, so `user.name` is `undefined`.
- Forgetting `await` on `fetch`, so `response` is a box (`Promise { <pending> }`).
- Assuming a 404 or 500 makes `fetch` throw. It does not; check `response.ok`.
- Putting an object into a template literal (`${user}`) and getting `[object Object]`.

### Exercise status

`lesson8/lesson8a.js`: items 1 to 5 done (2026-11-09). Item 2's prediction was wrong: `console.log(fetch(url))` prints `Promise { <pending> }`, not the server's metadata, because the response only exists after `await`. Item 5's prediction (`undefined undefined`) matched the output, but the reason is that `user` is a promise and a promise has no `name`; nothing throws, so this bug is silent. Use `https://jsonplaceholder.typicode.com`.

1. JSON warm-up (no network): `JSON.stringify` a student, print the result and its `typeof`, then `JSON.parse` it back and print the name. Predict first what `typeof JSON.stringify(student)` gives.
2. `async function`: fetch user 1 and print the user's name and email. Before you write it, predict what `console.log(fetch(url))` prints, then check.
3. Fetch all `/users` and print an array of just their names (use `map`).
4. Fetch `/users/9999` and print its `status` and `ok`.
5. Predict, then check: in item 2, remove the second `await`. What is `user`, and what does `user.name` give?

## Part 2: status codes, errors and POST (done, 2026-11-13)

All outputs below were run in Node against the same practice API.

### Two different ways a request can fail

1. **The server answered, but said no.** The status is 404, 500 and so on. `fetch` does **not** reject. You check `response.ok`.
2. **The request never got an answer** (no internet, a wrong domain). The promise **rejects**, so `catch` runs.

`try`/`catch` only sees the second kind. To handle both in one place, turn the first kind into a thrown error yourself:

```js
async function getUser(id) {
  const response = await fetch(`${BASE}/users/${id}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return await response.json();
}

try {
  const user = await getUser(1);
  console.log("found:", user.name);          // found: Leanne Graham
  await getUser(9999);                       // throws, so the next line never runs
  console.log("never printed");
} catch (error) {
  console.log("caught:", error.message);     // caught: Request failed: 404
}

try {
  await fetch("https://this-domain-does-not-exist-xyz.example/users");
} catch (error) {
  console.log(error.name, error.message);    // TypeError fetch failed
}
```

`throw` inside an `async` function makes its promise reject, which is exactly what `await` plus `catch` expects (Lesson 7). The helper hides the two kinds of failure behind one `catch`.

### Status codes you will see

| Code | Meaning | `response.ok` |
|---|---|---|
| 200 | OK, here is what you asked for | true |
| 201 | Created, your POST made something new | true |
| 400 | Bad request, the server could not understand what you sent | false |
| 401 / 403 | Not logged in / not allowed | false |
| 404 | Not found | false |
| 500 | The server itself crashed | false |

`response.ok` is simply `true` for any status from 200 to 299.

### What "GET" and "POST" mean

Every `fetch` is a message to another computer (a server). The message starts with a **verb** that says what you want done. This verb is called the **HTTP method**. Two matter for now:

| Method | Plain meaning | Does the server change? | Real-life version |
|---|---|---|---|
| **GET** | "Give me something." | No, you only read | Asking a librarian to bring you a book |
| **POST** | "Here is something, store it." | Yes, something new is created | Handing the librarian a form to add a new book |

- Everything you did in Part 1 and in items 1 to 3 was a GET. `fetch(url)` with nothing else **is** a GET: writing `fetch(url, { method: "GET" })` gives the identical result (both returned the same 100 posts).
- Other methods exist (`PUT` to replace, `DELETE` to remove). You do not need them yet.
- Later, in FastAPI, you write the **server side** of these: `@app.get(...)` handles a GET and `@app.post(...)` handles a POST. A React form will POST what the user typed to your Python backend. In Python's `requests` library the same two are `requests.get(url)` and `requests.post(url, json=data)`.

### POST: sending data

A GET needs nothing except the address. A POST also has to carry the data, so `fetch` takes a **second argument**, an options object, with three parts. Think of posting a letter: `method` is what is written on the front ("please store this"), `headers` is a label saying what language the letter is in, and `body` is the letter itself.

```js
const newPost = { title: "My first post", body: "Hello from fetch", userId: 1 };

const response = await fetch(`${BASE}/posts`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(newPost),
});

console.log(response.status, response.ok);   // 201 true
console.log(await response.json());
// { title: 'My first post', body: 'Hello from fetch', userId: 1, id: 101 }
```

- `method`: `"GET"` is the default. A POST must say so.
- `headers`: labels sent with the request. `Content-Type: application/json` tells the server the body is JSON.
- `body`: must be a **string** (or similar), so an object goes through `JSON.stringify` (Part 1). This is the same job as `requests.post(url, json=data)` in Python, which does the stringify and the header for you.
- The status is **201**, not 200: something was created. The server replied with the new post, now with an `id`. (This practice API pretends to save it; it is not really stored.)

### Common mistakes

- Passing the object as the body without `JSON.stringify`. JavaScript quietly turns it into the text `"[object Object]"` (the same thing that happens to `${student}` in a template literal). The request is still sent, but the server cannot read that text as JSON and answers with status **500** and a plain-text error. Your code then calls `response.json()` on that text, which fails with `SyntaxError: ... is not valid JSON`. The real problem (the 500) shows up one step later than the cause. Checking `response.ok` before `response.json()` would have caught it with a clear message.
- Leaving out the `Content-Type` header. This practice API forgives it (it replied `201` with only `{ id: 101 }`, so your fields were lost), but a real server often will not.
- Expecting `catch` to run on a 404. It only runs if you throw (the `getUser` pattern above) or the network fails.

### Exercise status

`lesson8/lesson8b.js`: items 1 to 6 done (2026-11-13). `getUser`, one `try` for both users, the network failure (`TypeError fetch failed`), a POST (status 201, the server adds an `id`), a POST without `JSON.stringify` (status 500, caught by the `ok` check) and a two-argument `createPost`. The terms GET and POST had not been explained before this part, so items 4 to 6 were re-taught from scratch. Several predictions were skipped; write them down next time, because that is where the learning happens.


---

# Lesson 9: Mini project, a user activity report

You have now met every piece you need: `fetch`, `async`/`await`, `try`/`catch`, and the array methods. This lesson uses them together on a real API, with nothing new to learn. The point is the habit of building something **in small, tested steps**.

## What you will build

A script that loads three lists from the practice API (`https://jsonplaceholder.typicode.com`), combines them, and prints a report:

- `/users`: 10 users (each has a `name` and an `address.city`)
- `/posts`: 100 posts, each with a `userId` saying who wrote it
- `/todos`: 200 todos, each with a `userId` and a `completed` flag (`true` or `false`)

For every user the report shows their **name, city, number of posts, number of completed todos and total todos**. Then it names the user who completed the most todos.

## How to build it: one function, one job

Do not write it all at once. Write one small function, run it, check it, and only then write the next.

| Step | Function | Job | Tools you already know |
|---|---|---|---|
| 1 | `getJson(path)` | Fetch `BASE + path`, throw if `!response.ok`, return the parsed JSON | `fetch`, `await`, `throw` (like `getUser`) |
| 2 | `loadData()` | Get users, posts and todos with `getJson` and return all three | `await` three times |
| 3 | `buildReport(users, posts, todos)` | Return one object per user: `{ name, city, posts, doneTodos, totalTodos }` | `map`, `filter`, `.length` |
| 4 | print | Show the report | `console.table(report)` or a loop with template literals |
| 5 | `findTopUser(report)` | The user with the most completed todos | `reduce`, or `sort` |
| 6 | `main()` | Call the steps inside `try`/`catch` and print `error.message` | `try`/`catch` |

### Hints

- To count one user's posts: filter the posts where `post.userId === user.id`, then take `.length`.
- Destructuring helps: `const [users, posts, todos] = await loadData();` if `loadData` returns an array of three.
- `console.table(array)` prints an array of objects as a table. It is new, but it is only a nicer `console.log`.

## Check your own work

You should not need me to tell you whether it is right. These facts about the real data let you check:

- There are 10 users, and each has exactly 10 posts and 20 todos.
- The completed-todo counts for users 1 to 10, in order, are `11, 8, 7, 6, 12, 6, 9, 11, 8, 12`, which add up to **90**.
- **Careful:** two users tie for the most completed todos (12 each). Decide what your program should print when there is a tie. Printing only the first one hides the other.
- To test your error handling, change one path to something that does not exist (for example `"/userz"`). The report should be replaced by a clear `Request failed: 404`, not a crash.

## Stretch (optional)

`Promise.all([...])` runs several promises at once and waits for all of them. You could use it in `loadData` so the three requests run together instead of one after another. It is not needed for the project.

### Exercise status

`lesson9/lesson9.js`: all six steps done (2026-11-13): `getJson`, `loadData` (returns an object), `buildReport` (map and filter, then `async` removed because nothing is awaited inside), `printReport` with `console.table`, `findTopUser` (two passes, handles the tie between Chelsey Dietrich and Clementina DuBuque at 12) and `main()` with one `try`/`catch`. A wrong path prints only "An error occurred: Request failed: 404". Slips along the way: a stray comma in the error message, `userID` instead of `userId`, a `map` callback without `return`, an unneeded `async`, and old test code left at the top level that ran the job twice. Predictions were mostly left blank.

# Quick reference (Lesson 1)

```js
const name = "Maruf";                         // fixed value
let count = 0;                                // changing value
console.log(`Hello ${name}`);                 // template literal
typeof name;                                  // "string"

if (count === 0 && name !== "") { }           // === and !==, && || !
for (let i = 0; i < 5; i++) { }               // counted loop
for (const item of items) { }                 // every item of an array
while (count < 3) { count++; }                // repeat until false
```

# Error messages seen so far

| Error | Meaning |
|---|---|
| `TypeError: Assignment to constant variable.` | You reassigned a `const`. Use `let` if it really has to change. |

---

# Template for future lessons

Each new lesson should have: what it is and why, rules with examples, Python comparison, common mistakes, in my own words, exercise status.
