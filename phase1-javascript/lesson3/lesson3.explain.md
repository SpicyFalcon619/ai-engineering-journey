## Warm-ups

Four tiny experiments with the two ideas this lesson is built on.

**A, object destructuring.** `const { x, y: z } = p` pulls properties out of an object by **name**. `x` is the property called `x`. `y: z` means "take the property `y`, but call my variable `z`". So `z` holds `2`, not `3` (the property `z` of `p` is never used). It prints `1 2`.

**B, array destructuring.** `const [a, b] = nums` pulls items out of an array by **position**: the first item goes into `a`, the second into `b`. It prints `10 20`.

**C, spread on an array.** `[...base, 3]` means "put all the items of `base` here, then add 3". It builds a **new** array, so `base` is untouched.

**D, spread on an object.** `{ ...o, b: 99, c: 3 }` copies every property of `o`, then overwrites `b` and adds `c`. Later properties win, which is why `b` becomes 99. Again `o` itself does not change.

## Exercise 5

This is only the shared data for the six questions below: an array of student objects, each with a `name`, a `score` and a list of `tags`. Nothing is printed here.

## 1. Tag and last student

`students.at(-1)` is the last item (a negative index counts from the end, like Python). That is Mina. Then `.name` reads a property from her object, and `.tags[1]` reads the second item of her tags array. Chaining dots and brackets just follows the data one step at a time. It prints `Mina js`.

## 2. Destructure name and score

`const { name, score } = students[0]` does in one line what two lines of `students[0].name` and `students[0].score` would do. The variable names must match the property names.

## 3. Copy with a changed score (spread)

`{ ...students[1], score: 70 }` makes a **copy** of Rahim's object with `score` replaced by 70. The original is still 45, as the first print shows.

Why bother? An assignment like `const b = a` copies only the reference, so both names would point at the same object. Spread is the easy way to get a real copy.

## 4. push onto a const array

`const` stops the **name** `students` from being pointed at something else. It does not freeze what is inside. `push` changes the contents of the same array, so it is allowed. Trying `students = []` would be the real error.

## 5. describe (destructuring in the parameters)

Destructuring also works inside the parameter list: `({ name, score, tags }) => ...` takes the object that is passed in and unpacks it before the function body runs. The template literal then prints the three values. An array inside a template literal is turned into text with commas, so the tags appear as `ml,python`.

## 6. sum with a rest parameter

`...nums` in a **parameter list** is the rest parameter: it gathers every argument into one array called `nums`. It looks like spread, but it does the opposite job. Spread unpacks an array into items, and rest packs items into an array.

So `sum(1, 2, 3, 4)` gets `[1, 2, 3, 4]` and adds them to 10. `sum()` with nothing gets an empty array, the loop never runs, and the total stays 0. It is the same idea as `int... nums` in Java.
