## Temperature chain

An `if / else if / else` chain is read from the top, and it stops at the first condition that is true. The other branches are skipped. Here `31 > 30` is true straight away, so it prints `Hot` and never looks at the rest.

`&&` means "and": both sides must be true. `temperature >= 20 && temperature <= 30` is true only for 20 to 30, so that branch means "warm". `else` has no condition: it catches everything that did not match above.

## Predictions

The surprising one is `10 == "10"`, which is `true`. The double-equals `==` converts the types before comparing, so the string `"10"` becomes the number `10` first. The triple-equals `===` compares the value and the type, so `10 === "10"` is `false`.

Use `===` almost always. `==` hides bugs, because it can say two different things are equal.

The other two are plain logic: `true && false` is `false` (and needs both), and `!false` flips it to `true`.
