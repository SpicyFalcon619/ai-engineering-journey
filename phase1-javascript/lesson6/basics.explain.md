## Step 1: defining a function vs running it

Your answer is right. `sayHi` is the function itself: think of it as a recipe card. `sayHi()` with parentheses is the instruction "now follow the recipe".

Defining the function prints nothing. The text `Hi!` appears only at the moment of the call. That is why the output is `A`, `Hi!`, `B`, in the order the lines run.

## Step 2: handing a function to another function

`doThreeTimes(sayHi)` hands over the recipe card. Inside, the parameter `recipe` holds that function, and `recipe()` follows it, three times.

Your prediction for the wrong version was exactly right. In `doThreeTimes(sayHi())`, the inner `sayHi()` runs **first** and prints `Hi!` once. It returns nothing, so `recipe` becomes `undefined`, and the first `recipe()` fails with `TypeError: recipe is not a function`.

## Step 3: a timer runs your function later

`setTimeout(fn, 2000)` does not run `fn` now. It hands `fn` to the timer and moves straight on to the next line. So `B` prints right away, and `Hi! after 2 sec` prints two seconds later.

Your answer is right: JavaScript does not stop and wait. This is also why `undefined` from Step 4 appears in the output **before** the timer's line, even though Step 3 is earlier in the file. The timer fires after the rest of the file has finished.

## Step 4: arrow functions

**a)** With braces the function body is a block, so you must write `return`: `(a, b) => { return a + b; }`.

**b)** Without braces, the single expression is returned automatically: `(name) => "Hi " + name`.

**d)** This is the trap from Lesson 4. `(n) => { n * 2; }` has braces but no `return`. The multiplication is calculated and thrown away, so `f(4)` gives back `undefined`. Your prediction was right.
