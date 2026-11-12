## 1. average (function declaration)

A function is written `function name(parameters) { ... }`. The word `return` sends a result back to whoever called it. Without `return`, the function gives back `undefined`.

The loop adds all the numbers into `total`, and then `total / numbers.length` is the average: 316 divided by 5 is 63.2. In JavaScript `/` on numbers always gives the real division, with no integer-division trap like in C or Java.

## 2. isPassing (arrow function with a default parameter)

An arrow function is a shorter way to write a function: `(parameters) => result`. When there are no braces after the arrow, the expression is returned automatically, so `score >= threshold` is the return value. With braces you must write `return` yourself (a common mistake).

`threshold = 60` is a **default parameter**. If the caller leaves the argument out, 60 is used. `isPassing(59, 50)` supplies its own 50, which replaces the default, so 59 passes.

## 3. applyTwice (a function that takes a function)

In JavaScript a function is a value, like a number. You can store it in a variable and pass it to another function.

`fn(fn(x))` calls `fn` on `x`, then calls it again on the result. With `double`, that is `double(double(5))`, which is `double(10)`, which is 20. The second example passes an arrow function directly: `(10 + 3) + 3` is 16.

Notice `applyTwice(double, 5)` has no parentheses after `double`. You pass the function itself. Writing `double(5)` would run it first and pass its result instead. This idea is the root of callbacks, which come back in Lesson 6.

## 4. Missing and extra arguments

JavaScript does not check how many arguments you pass, unlike Java or C++. If an argument is missing, that parameter is `undefined`, and `1 + undefined` is `NaN` ("not a number"). If you pass too many, the extra ones are quietly ignored, so `f(1, 2, 3)` is just `1 + 2`.

Both of your predictions were right: `NaN` and `3`. This is exactly why default parameters (item 2) are useful: they replace a surprise `undefined` with a sensible value.
