## 2. Import named exports

A file shares things with the `export` keyword, and another file brings them in with `import`. A **named export** is imported with braces, and the names inside must match the exported names exactly: `import { add, multiply } from "./mathUtils.js"`.

The path starts with `./` ("this folder") and keeps the `.js` ending. Without that start, JavaScript would look for an installed package instead of your own file. The folder's `package.json` has `"type": "module"`, which tells Node that these files use `import` and `export`.

`add(2, 3)` is 5 and `multiply(4, 5)` is 20, so it prints `5 20`.

## 3. Import with a rename

`TAX_RATE as taxRate` renames a name as it comes in. It is useful when the name would clash with one you already have, or when you want a different style. Constants are usually `UPPER_CASE` and ordinary variables `camelCase`.

After the rename, only `taxRate` exists in this file. `TAX_RATE` is not available here. `100 * 0.1` is 10.

## 5. Import the default export and a named export

A file may have **one** default export, the main thing it provides. It is imported **without braces**, and you can call it whatever you like: `import students from "./students.js"`.

Named exports still go in braces, and both can share one line: `import students, { getPassing } from "./students.js"`.

`getPassing` keeps the students with a score of 60 or more and returns just their names. Rahim has 45, so he is left out.

## 6. Predict, then check

Writing `import { students } from "./students.js"`, with braces, looks for a **named** export called `students`. But `students` is the default export, so Node stops with `The requested module './students.js' does not provide an export named 'students'`.

The rule to remember: braces mean named, and no braces mean default. `scratch.js` makes this mistake on purpose, so you can see the real message.
