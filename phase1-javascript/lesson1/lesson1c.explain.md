## 1. Print 1 to 5

A `for` loop has three parts inside the parentheses, separated by semicolons: where to start (`let i = 1`), when to keep going (`i <= 5`), and what to do after each round (`i++`). It works exactly as in C, C++ and Java.

`i` is declared with `let` because it changes every round.

## 2. Even numbers from 1 to 10

`%` gives the remainder after dividing. An even number divided by 2 leaves a remainder of 0, so `i % 2 === 0` picks out 2, 4, 6, 8 and 10.

The `if` sits inside the loop, so it is asked once for every `i`, and `console.log` runs only when the answer is yes.

## 3. Total of the scores

This is the accumulator pattern: make a variable that starts at 0, and add each item to it. `let total = 0` must be `let` because it changes.

`for (const score of scores)` walks the values of the array directly, with no index. `const` is fine here because every round creates a fresh `score`. The scores add up to 316.

## 4. Count of passing scores

A counter is the same shape as an accumulator, except you add 1 only when a condition is true. Here `score >= 60` is true for 82, 91 and 60, so `passed` ends at 3.

The last line of the file prints both results together. `\n` inside the string starts a new line.
