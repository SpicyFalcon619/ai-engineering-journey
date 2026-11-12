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
// Result: getJson("/users") gives the list of 10 users. A wrong path such as
// "/userz" throws "Request failed: 404".
async function getJson(path) {
  const response = await fetch(`${BASE}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return await response.json();
}

// --- Step 2: loadData() ---
// Use getJson to get "/users", "/posts" and "/todos". Return all three.
// Result: an object holding the three lists: 10 users, 100 posts, 200 todos.

async function loadData() {
  const users = await getJson("/users");
  const posts = await getJson("/posts");
  const todos = await getJson("/todos");

  return { users, posts, todos };
}

// --- Step 3: buildReport(users, posts, todos) ---
// Return one object per user: { name, city, posts, doneTodos, totalTodos }
// where posts is how many posts they wrote and doneTodos is how many of their
// todos have completed === true.
// Result: 10 rows. Every user has 10 posts and 20 todos, and the completed
// counts add up to 90.
function buildReport(users, posts, todos) {
  return users.map((user) => {
    const userPosts = posts.filter((p) => p.userId === user.id);

    const userTodos = todos.filter((t) => t.userId === user.id);

    const doneTodos = userTodos.filter((t) => t.completed).length;

    return {
      name: user.name,
      city: user.address.city,
      posts: userPosts.length,
      doneTodos,
      totalTodos: userTodos.length,
    };
  });
}

// --- Step 4: print the report ---
// console.table(report) is a quick way. A loop with template literals also works.
// Result: console.table prints one row per user.

function printReport(report) {
  console.table(report);
}

// --- Step 5: findTopUser(report) ---
// The user with the most completed todos. Two users tie, so decide what to
// print when that happens.
// Result: two users tie with 12 completed todos, so both names are printed.

function findTopUser(report) {
  if (report.length === 0) return null;

  let maxDone = -1;
  for (const user of report) {
    if (user.doneTodos > maxDone) {
      maxDone = user.doneTodos;
    }
  }

  const topUsers = report.filter((user) => user.doneTodos === maxDone);

  if (topUsers.length === 1) {
    console.log(
      `Top User: ${topUsers[0].name} with ${maxDone} completed todos!`,
    );
  } else {
    const names = topUsers.map((u) => u.name).join(", ");
    console.log(
      `It's a tie! Top Users: ${names} with ${maxDone} completed todos each.`,
    );
  }

  return topUsers;
}

// --- Step 6: main() ---
// Call the steps inside try/catch. Print error.message if anything fails.
// Test it by changing a path to "/userz" and checking you get a clear message.
// Result: the whole report prints. With a wrong path, only "An error occurred:
// Request failed: 404" prints, because the first failure jumps straight to catch.
async function main() {
  try {
    const { users, posts, todos } = await loadData();

    const report = buildReport(users, posts, todos);

    printReport(report);

    findTopUser(report);
  } catch (error) {
    console.log("An error occurred:", error.message);
  }
}

main();
