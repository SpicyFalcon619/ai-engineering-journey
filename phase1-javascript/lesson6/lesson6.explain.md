## 1. Print order

Your prediction, `A C B`, is right. JavaScript runs the lines of your code top to bottom first: it prints `A`, hands the timer function to `setTimeout`, and prints `C`. Only when that code has finished does it go and run the function the timer was holding.

Even with a delay of `0`, the timer's function never runs "now". It always waits until the current code is done. That rule is the key to everything about promises and `async`.

## 2. wait(ms)

`new Promise((resolve, reject) => { ... })` makes the box. JavaScript calls your function and gives it two buttons: `resolve` for "it worked" and `reject` for "it failed". Here the timer presses `resolve` after `ms` milliseconds.

The box is handed back **immediately**. `.then(fn)` says "when the button is pressed, run `fn`". So `1 sec passed` appears about a second later, after everything else has already printed.

## 3. getStudent(name)

This promise has two possible endings. After 500 ms it looks the name up. If a student is found, it presses `resolve(student)`. If not, it presses `reject(new Error("Student not found"))`.

On the receiving side, `.then(fn)` runs on success and `.catch(fn)` runs on failure. For `"Mina"` the object is printed. For `"Zed"` the promise is rejected, so the `.then` is skipped and the `.catch` prints `Student not found`. `error.message` is the text you gave to `new Error(...)`.

## 4. Chain

`.then` itself returns a new promise, so you can attach another `.then` after it. Whatever one step **returns** is what the next step receives.

So it goes: the student object, then `student.score` (82), then `score + 5` (87), then it is printed. Each arrow function has no braces, so its value is returned automatically.

## 5. A then without return

Your first guess was "it will throw an error", and your correction in the file is right. Nothing breaks by itself.

When the middle step uses braces and has no `return`, it returns `undefined`, and the next step simply receives `undefined`. The printed line shows exactly that. An error would only appear if a later step tried to **use** the missing value, for example `result.toFixed(1)` on `undefined`.

It is the same trap as `map` with braces in Lesson 4: braces mean a block of statements, and a block gives back nothing unless you write `return`.
