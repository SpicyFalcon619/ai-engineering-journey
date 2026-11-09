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
// My prediction: string
const student = { name: "Aisha", score: 82, tags: ["ml", "python"] };

// stringify turns the object into one line of text (JSON).
const text = JSON.stringify(student);
console.log(text);
console.log(typeof text);

// parse turns that text back into a real object, so .name works again.
const copy = JSON.parse(text);
console.log(copy.name);

// --- 2. Fetch one user ---
// async function: fetch `${BASE}/users/1` and print the user's name and email.
// Predict first: what does console.log(fetch(url)) print?
// My prediction: it will print the server metadata and other status
async function fetchOneUser() {
  const response = await fetch(`${BASE}/users/1`);
  const user = await response.json();

  console.log(user.name, user.email);
}

fetchOneUser();

// --- 3. Fetch all users ---
// Fetch `${BASE}/users` and print an array of just their names (use map).
async function fetchUsers() {
  const response = await fetch(`${BASE}/users`);
  const users = await response.json();

  const names = users.map((u) => u.name);
  console.log(names);
}

fetchUsers();

// --- 4. A user that does not exist ---
// Fetch `${BASE}/users/9999` and print its status and ok.
async function fetchNoUser() {
  const response = await fetch(`${BASE}/users/9999`);

  console.log(response.status, response.ok);
}

fetchNoUser();

// --- 5. Forgetting the second await ---
// Predict: in item 2, if you remove the await before response.json(), what is
// user, and what does user.name give? Then check.
// My prediction: undefined undefined
async function fetchWrong() {
  const response = await fetch(`${BASE}/users/1`);
  const user = response.json();

  console.log(user.name, user.email);
}

fetchWrong();
