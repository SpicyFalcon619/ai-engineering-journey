## Variables

JavaScript has two ways to declare a variable. `const` is for a value that never gets reassigned, and `let` is for one that does. There is no type written in front (no `int age`): the value itself carries its type.

`semester` is declared with `let` because `semester++` changes it later. If you wrote `const semester = 1` and then `semester++`, you would get `TypeError: Assignment to constant variable.`, the error from Lesson 1.

A good habit: start with `const`, and switch to `let` only when the compiler-like error tells you that you really do reassign it.

## Template literal

Backticks (`` ` ``) make a string that can hold values. Anything inside `${ ... }` is computed and pasted in, so `${name}` becomes `Maruf`. It is the JavaScript version of a Python f-string or `String.format` in Java.

Ordinary quotes (`"..."`) do not do this. If you wrote `"My name is ${name}"`, you would print the dollar sign and braces as plain text.

## Types

`typeof` tells you what kind of value a variable holds right now: `string`, `number` or `boolean`.

All numbers share one type, `number`. There is no separate `int` and `double`, so both `22` and `1.5` print `number`. And `semester` is still a `number` after `semester++`, because incrementing changes the value, not the type.
