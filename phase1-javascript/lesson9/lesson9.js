// Lesson 9: mini project, a user activity report
//
// Load users, posts and todos from a public API, combine them, and print a
// report. Read the brief and the hints in NOTES.md (Lesson 9) first.
// Free practice API (no key needed): https://jsonplaceholder.typicode.com
//
// Build it one function at a time. Run the file after each step.

const BASE = "https://jsonplaceholder.typicode.com";

// --- Step 1: getJson(path) ---
// Fetch `${BASE}${path}`. If response.ok is false, throw an Error that says
// "Request failed: " and the status. Otherwise return the parsed JSON.
// TODO

// --- Step 2: loadData() ---
// Use getJson to get "/users", "/posts" and "/todos". Return all three.
// TODO

// --- Step 3: buildReport(users, posts, todos) ---
// Return one object per user: { name, city, posts, doneTodos, totalTodos }
// where posts is how many posts they wrote and doneTodos is how many of their
// todos have completed === true.
// TODO

// --- Step 4: print the report ---
// console.table(report) is a quick way. A loop with template literals also works.
// TODO

// --- Step 5: findTopUser(report) ---
// The user with the most completed todos. Two users tie, so decide what to
// print when that happens.
// TODO

// --- Step 6: main() ---
// Call the steps inside try/catch. Print error.message if anything fails.
// Test it by changing a path to "/userz" and checking you get a clear message.
// TODO
