## 1. A helper that turns a bad status into an error

There are two ways a request can go wrong. The server can answer "no" (a 404 or 500, and `fetch` does **not** reject), or no answer can arrive at all (and `fetch` rejects). `try`/`catch` only sees the second kind.

This helper turns the first kind into a real error with `throw`. After that, both kinds of failure end up in the same `catch`. Inside an `async` function, a `throw` makes its promise reject, which is exactly what `await` plus `catch` is waiting for.

`getUser(9)` works, so it prints the user. `getUser(9999)` would throw `Request failed: 404`.

## 2. One try/catch for both users

Everything inside the `try` runs in order, and the first error jumps straight to `catch`. User 1 works and prints `User 1: Leanne Graham`. Then `getUser(9999)` throws, so the line after it (`console.log("User 9999:" ...)`) **never runs**, and the `catch` prints `Caught an error: Request failed: 404`.

One `try` for several steps is a good habit: you do not need to check each step for failure.

## 3. The network fails

The domain does not exist, so no server ever answers. In that case `fetch` itself rejects, and the `catch` runs with `TypeError fetch failed`.

Compare it with the 404 in item 2: the server answered, said no, and you had to notice by checking `response.ok`. Here **nothing answered**, so there is no `response` at all. The two lines after the `fetch` inside the `try` are never reached.

## 4. POST a new post

**GET** means "give me something" and **POST** means "here is something, please store it". A POST needs three things in the options object: the `method`, the `headers` (a label saying the data is JSON) and the `body` (the data itself, as text, so it goes through `JSON.stringify`).

The server answers with status **201**, "Created", which still counts as `ok`. It also adds an `id` (101) to the post, because the server chooses ids. Your prediction of 201 was right.

Note that the field is `userId`. A server only understands the exact name it expects.

## 5. Break it on purpose

If `body` is a plain object, JavaScript quietly turns it into the text `[object Object]` (the same thing as `${student}` in Lesson 2). The server cannot read that as JSON, so it answers with status **500** and a plain-text error message.

The mistake is in the `body`, but without a check you would only see it one step later, when `response.json()` tries to parse that error text and fails with a `SyntaxError`. Your `response.ok` check stops it earlier, with a clear `Request failed: 500`. That is the reason to check `ok` before calling `.json()`.

## 6. A createPost helper

This is the same helper as item 4, but it takes two plain values and builds the object itself: `{ title, body, userId: 1 }`. `{ title, body }` is short for `{ title: title, body: body }`.

Using it inside `try`/`catch` means the caller does not have to know about status codes or JSON at all. It either gets the created post back or catches a clear error. Wrapping the messy details in a small function like this is exactly how real code stays readable.
