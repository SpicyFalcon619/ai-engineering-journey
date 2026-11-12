## 1. some and every

`some` asks "is it true for **at least one** item?", and `every` asks "is it true for **all** of them?". Both give back a single `true` or `false`, not an array.

Anyone above 90? Yes, 91, so `some` is `true`. Everyone at least 40? No, because of 38, so `every` is `false`. They stop as soon as the answer is known.

## 2. reduce: total and average

`reduce` squeezes a whole array down to **one value**. Its function receives two things: the running result so far (`sum`, called the accumulator) and the current item (`s`). Whatever the function returns becomes the running result for the next round.

The `0` after the function is the starting value. So it goes 0, then 82, then 127, and so on up to 316. The average is then `316 / 5`, which is 63.2.

## 3. reduce: the highest score (no Math.max)

With no starting value, `reduce` uses the **first item** as the starting result and begins from the second. The function keeps the larger of "the highest so far" and "this item".

That is neat, but there is a catch: on an **empty** array there is no first item, so `reduce` throws an error. Giving a starting value (like the `0` in item 2) avoids that.

## 4. sort: scores in descending order, without changing the original

`sort` rearranges the array **in place**, which means it changes the original. To keep the original, make a copy first: `[...scores]` (spread, from Lesson 3) and sort the copy.

The sorting function takes two items, `a` and `b`. If it returns a negative number, `a` goes first; positive, `b` goes first. `b - a` puts bigger numbers first, so it sorts from highest to lowest. The first print shows the original, still in its old order.

## 5. sort the students from highest to lowest score, print only the names

Same idea, using objects: compare `b.score - a.score`. The chain is copy, then sort, then `map` to pull out just the names. Order matters again: sort first, while the items are still whole students, then map.

Noman (99) is now first and Rahim (45) last.

## 6. Predict, then check

By default `sort` turns every item into **text** and sorts alphabetically. As text, `"100"` comes before `"25"`, which comes before `"3"`, because it compares one character at a time (`"1"` is before `"2"`, which is before `"3"`). So the numbers are already in that "alphabetical" order and nothing moves.

The lesson: when sorting numbers, always pass a comparison function like `(a, b) => a - b`.
