// Lesson 8 (part 1): JSON and GET requests with fetch
//
// Reminder: fetch(url) gives back a promise (a box). await it to get a Response.
// response.json() is a SECOND promise, so it needs its own await.
// Free practice API (no key needed): https://jsonplaceholder.typicode.com

const BASE = "https://jsonplaceholder.typicode.com";

// --- 1. JSON warm-up (no network) ---
// JSON.stringify a student, print the result and its typeof. Then JSON.parse it
// back and print the name.
// Predict first: what does typeof JSON.stringify(student) give?
// My prediction:
// TODO

// --- 2. Fetch one user ---
// async function: fetch `${BASE}/users/1` and print the user's name and email.
// Predict first: what does console.log(fetch(url)) print?
// My prediction:
// TODO

// --- 3. Fetch all users ---
// Fetch `${BASE}/users` and print an array of just their names (use map).
// TODO

// --- 4. A user that does not exist ---
// Fetch `${BASE}/users/9999` and print its status and ok.
// TODO

// --- 5. Forgetting the second await ---
// Predict: in item 2, if you remove the await before response.json(), what is
// user, and what does user.name give? Then check.
// My prediction:
// TODO
