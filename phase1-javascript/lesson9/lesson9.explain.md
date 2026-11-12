## Step 1: getJson(path)

Start from `getUser` in Lesson 8, but make the address a parameter so one helper can fetch any list. Join `BASE` and `path` in a template literal, check `response.ok` the same way, and return `await response.json()`.

To test it, call `getJson("/users")` and print how many users come back. You should see 10.

## Step 2: loadData()

An `async` function that calls your helper three times with `await`: once each for `"/users"`, `"/posts"` and `"/todos"`. Return the three results together, for example as an array `[users, posts, todos]`.

Test it by printing the three lengths. They should be 10, 100 and 200. If one is wrong, a path is probably misspelled.

## Step 3: buildReport(users, posts, todos)

This is the heart of the project, and it has no `fetch` in it at all: it only takes data in and returns new data. That makes it easy to test.

Use `users.map(...)`. For each user, `posts.filter((p) => p.userId === user.id).length` counts that user's posts. Count the todos the same way, once for all of them and once with `todo.completed` added to the condition. `user.address.city` reaches into the nested object.

A good check: every user should have 10 posts and 20 todos.

## Step 4: print the report

`console.table(report)` prints an array of objects as a table, one row per user. It is only a nicer `console.log`. If you prefer, a `for...of` loop with a template literal per user works just as well.

## Step 5: findTopUser(report)

You want the user with the most completed todos, and there are two usual ways. With `reduce`, keep the better of "the best so far" and "this user". With `sort`, put the biggest first (and remember to sort a **copy**).

Beware: two users tie at 12. A plain `reduce` returns only one of them and hides the other. To report both, first find the highest number, then `filter` the report for everyone who has that number.

## Step 6: main()

Put the steps together in one `async` function inside a `try`, and call it. In the `catch`, print `error.message`.

To check that the error path works, change a path to `"/userz"` and run it again. You should see `Request failed: 404`, not a crash and not a half-finished report.
