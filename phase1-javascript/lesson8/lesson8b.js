// Lesson 8 (part 2): status codes, errors and POST
//
// Reminder: fetch does NOT reject on a 404. Check response.ok yourself.
// A POST needs method, headers and a body that is a STRING (JSON.stringify).
// Free practice API (no key needed): https://jsonplaceholder.typicode.com

const BASE = "https://jsonplaceholder.typicode.com";

// --- 1. A helper that turns a bad status into an error ---
// Write async function getUser(id): fetch `${BASE}/users/${id}`. If
// response.ok is false, throw new Error(`Request failed: ${response.status}`).
// Otherwise return the parsed user.
async function getUser(id) {
  const response = await fetch(`${BASE}/users/${id}`);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return await response.json();
}

await getUser(9)
  .then((user) => console.log(user))
  .catch((error) => console.log(error.message));

// --- 2. One try/catch for both users ---
// Inside one try block: get user 1 and print the name, then get user 9999 and
// print the name. In catch, print the error message.
// Predict first: which lines print, and which never run?
// My prediction: (skipped)
// Actual: User 1 prints. getUser(9999) throws, so the line after it never runs,
// and catch prints "Request failed: 404".
async function getTwoUser() {
  try {
    const user1 = await getUser(1);
    console.log("User 1:", user1.name);

    const user9999 = await getUser(9999);
    console.log("User 9999:", user9999.name);
  } catch (error) {
    console.log("Caught an error:", error.message);
  }
}

await getTwoUser();

// --- 3. The network fails ---
// In a try/catch, fetch "https://this-domain-does-not-exist-xyz.example/users".
// Print error.name and error.message.
// Predict first: does this reach catch? Is it the same kind of failure as a 404?
// My prediction: (skipped)
// Actual: it reaches catch and prints "TypeError fetch failed". A different kind
// of failure from a 404: no answer came back at all, so there is no response.
async function testNetworkFailure() {
  try {
    const response = await fetch(
      "https://this-domain-does-not-exist-xyz.example/users",
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error.name, error.message);
  }
}

await testNetworkFailure();

// --- 4. POST a new post ---
// POST { title, body, userId: 1 } to `${BASE}/posts` (method, headers, and a
// stringified body). Print the status, response.ok and the created post.
// Predict first: will the status be 200 or 201? What new field will the post have?
// My prediction: 201
// Actual: 201 true, and the server adds an id (101).
async function createPostFromObject(postData) {
  const response = await fetch(`${BASE}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  console.log(response.status, response.ok);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return await response.json();
}

const newPost = {
  title: "New Post Title",
  body: "New Post Body",
  userId: 1,
};

await createPostFromObject(newPost)
  .then((result) => console.log("Success: ", result))
  .catch((error) => console.log("Error: ", error.message));

// --- 5. Break it on purpose ---
// Repeat item 4 but pass the object as the body WITHOUT JSON.stringify. Wrap it
// in try/catch and print error.message.
// Predict first: does the POST itself fail, or something later?
// My prediction: (skipped)
// Actual: the server answers 500, because the body became the text
// "[object Object]". The ok check catches it before response.json() is called.
// Without that check, response.json() would crash with a SyntaxError instead.
async function createPostFailed(postData) {
  const response = await fetch(`${BASE}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: postData,
  });

  console.log(response.status, response.ok);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return await response.json();
}

try {
  const result = await createPostFailed(newPost);
  console.log("Success: ", result);
} catch (error) {
  console.log("Error: ", error.message);
}

// --- 6. A createPost helper ---
// Write async function createPost(title, body): POST it, throw if !response.ok,
// and return the created post. Call it inside try/catch and print the result.
// The difference from item 4: this one takes two plain values and builds the
// object itself. { title, body } is short for { title: title, body: body }.
async function createPost(title, body) {
  const postData = { title, body, userId: 1 };

  const response = await fetch(`${BASE}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return await response.json();
}

try {
  const created = await createPost("Hello", "First post");
  console.log("Created:", created);
} catch (error) {
  console.log("Error:", error.message);
}
