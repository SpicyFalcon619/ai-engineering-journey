// Lesson 6: promises

const students = [
  { name: "Aisha", score: 82, tags: ["ml", "python"] },
  { name: "Rahim", score: 45, tags: ["web"] },
  { name: "Mina", score: 91, tags: ["ml", "js", "react"] },
  { name: "Noman", score: 99, tags: ["ml", "java", "python"] },
];

// --- 1. Print order ---
// Predict the order of A, B, C in a comment first, then run it:
//   console.log("A"); setTimeout(() => console.log("B"), 0); console.log("C");
// TODO

// --- 2. wait(ms) ---
// Return a promise that resolves after ms milliseconds.
// Use it: wait(1000).then(() => console.log("1 second passed"))
// TODO

// --- 3. getStudent(name) ---
// Returns a promise. After 500 ms it resolves with the matching student,
// or rejects with new Error("Student not found").
// Call it with "Mina" (print the object) and "Zed" (print only the error message).
// TODO

// --- 4. Chain ---
// From getStudent("Aisha"): take the score, add 5, print the final number.
// TODO

// --- 5. A then without return ---
// Predict: if a middle then uses braces and forgets return, what does the next then receive?
// TODO
