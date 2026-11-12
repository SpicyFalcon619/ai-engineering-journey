## 1. map: add 5 to every score

`map` takes a function and applies it to **every** item, and gives back a **new** array of the results, the same length as the original. Here the function is `(s) => s + 5`.

The original array is not changed, which the first line of output shows. When a question says "give me the same list, but transformed", the answer is `map`.

## 2. filter: scores of 60 or more

`filter` also takes a function, but this one answers yes or no. It keeps the items where the answer is `true` and drops the rest. The result can be shorter than the original, or even empty.

`82`, `91` and `60` pass `s >= 60`. The `60` stays because of the `>=`.

## 3. map: just the names

`map` can change the **kind** of thing, not just the number. Each student object goes in, and just its `name` comes out. The result is an array of strings. This pattern, "pull one field out of every object", is one of the most common in real code.

## 4. find: a student that exists, and one that does not

`find` returns the **first** item the function says yes to, as the item itself (not an array). Mina is found, so the whole object prints.

When nothing matches, `find` returns `undefined`, no error. That is why the second print shows `undefined`. In real code you check for it before using the result, because `undefined.name` would crash.

## 5. filter then map: passed and has the "ml" tag

Methods can be chained, and each one receives the output of the one before. Order matters. The `filter` comes first, while the items are still whole student objects, so it can look at `score` and `tags`. Then `map` pulls out just the names.

If you did `map` first, you would have only names left, and `filter` would have no `score` or `tags` to check.

`st.tags.includes("ml")` asks an array "do you contain this?", and `&&` joins the two conditions.

## 6. map without return

A very common trap. An arrow function with **braces** is a block of statements, and a block gives nothing back unless it says `return`. `s * 2;` computes a value and throws it away.

So every callback returns `undefined`, and `map` builds an array of five `undefined`s. Fix it by removing the braces (`(s) => s * 2`) or by adding `return`.
