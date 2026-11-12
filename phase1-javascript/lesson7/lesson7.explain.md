## 1. pause()

`await` pauses **only the async function it is inside**, not the whole program. Inside `pause`, the line `await wait(1000)` stops that function for a second. But the code that called `pause()` does not wait. It carries on to the next line straight away.

So the order is `start`, then `after calling pause`, then, a second later, `1 second later`. Your prediction was exactly right.

## 2. showScore()

`await getStudent("Mina")` pauses until the promise is resolved, and then gives you the value that was **inside** it: the student object. That is why you can write `student.name` immediately, with no `.then`.

It reads like ordinary top-to-bottom code, but under the hood it is the same promise from Lesson 6. `async`/`await` is only a cleaner way to write it.

## 3. findZed() with try / catch

When a promise is rejected, `await` turns that rejection into a thrown error right where the `await` is. So the same `try`/`catch` you know from Java or Python works.

`getStudent("Zed")` rejects, the `console.log(student)` line is skipped, and the `catch` block runs. `console.error` writes to the error stream, which is why this line is drawn as an error in the output.

## 4. Aisha plus 5, as async / await

This is the Lesson 6 chain written the new way. `await` gives the student, and you do the arithmetic on the next line: 82 plus 5 is 87.

Compare it with the `.then` chain: one value per line, no callbacks, nothing to forget to `return`.

## 5. Forgetting await

Without `await`, `getStudent("Mina")` returns the **promise itself**, the box, not what is inside. Printing it shows `Promise { <pending> }`.

A promise has no `score` property, so `student.score` is `undefined`. It is not `NaN`: you would only get `NaN` after arithmetic, like `student.score + 5`. Nothing throws an error, which makes this bug easy to miss. If you ever see `Promise { <pending> }` where you expected data, look for a missing `await`.
