## 1. JSON warm-up (no network)

JSON is a way of writing data as **text** so it can travel between programs, for example from a Python backend to a JavaScript page. `JSON.stringify(student)` turns the object into one line of text, and `JSON.parse(text)` turns that text back into a real object.

Your prediction was right: the result is a `string`, so `typeof` prints `string`. This matters because the text has no properties. `text.name` would be `undefined`, while `copy.name` works because `copy` is a real object again.

## 2. Fetch one user

`fetch(url)` starts a request and immediately gives back a **promise**. After `await`, you hold a `Response` object. It describes the reply (status, headers), but the data is not unpacked yet.

`response.json()` reads the body and turns the JSON text into an object, and it is **also** a promise, so it needs its own `await`. That is the two-step pattern you will use again and again: `await fetch(...)`, then `await response.json()`.

About the prediction: `console.log(fetch(url))` prints `Promise { <pending> }`, not the server's details. The response only exists after you `await` it.

## 3. Fetch all users

The `/users` address returns a list, so `response.json()` gives an **array** of 10 user objects. Every array method from Lesson 4 now works on real data. `users.map((u) => u.name)` pulls out the 10 names, the same pattern as the student names earlier.

## 4. A user that does not exist

The user 9999 does not exist, so the server answers with status `404`. And `response.ok` is `false`, because `ok` is only true for statuses from 200 to 299.

The important point: `fetch` did **not** fail. The server answered, and the answer was "not found". A promise rejects only when no answer arrives at all (for example, no internet). So you have to check `response.ok` yourself. Part 2 builds this into a helper.

## 5. Forgetting the second await

Without the second `await`, `user` is `Promise { <pending> }`, and `user.name` is `undefined`, because a promise has no `name`. Your printed result was right, and this is the reason behind it.

No error is thrown, so this bug is silent. If you ever see `undefined` where data should be, check that every `fetch` and every `.json()` has an `await`.
