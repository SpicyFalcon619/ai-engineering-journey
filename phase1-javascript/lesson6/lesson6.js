// Lesson 6: promises
//
// Reminder: a promise is a box that a function hands back right away.
// resolve is the button on the box: press it when the work is done.
// .then(fn) means: when the button is pressed, run fn.

const students = [
  { name: "Aisha", score: 82, tags: ["ml", "python"] },
  { name: "Rahim", score: 45, tags: ["web"] },
  { name: "Mina", score: 91, tags: ["ml", "js", "react"] },
  { name: "Noman", score: 99, tags: ["ml", "java", "python"] },
];

// --- 1. Print order ---
// Predict the order of A, B and C in a comment first, then run it.
// My prediction: A C B
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");

// --- 2. wait(ms) ---
// Write wait(ms): it returns a promise that resolves after ms milliseconds.
// Then use it: wait(1000).then(() => console.log("1 second passed"))
const wait = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
};

wait(1000).then(() => console.log("1 sec passed"));

// --- 3. getStudent(name) ---
// Returns a promise. After 500 ms it resolves with the matching student,
// or rejects with new Error("Student not found").
// Call it with "Mina" (print the object) and "Zed" (print only the error message).

const getStudent = (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const student = students.find((st) => {
        return st.name === name;
      });
      if (student) {
        resolve(student);
      } else {
        reject(new Error("Student not found"));
      }
    }, 500);
  });
};

getStudent("Mina")
  .then((student) => console.log(student))
  .catch((error) => console.log(error.message));

getStudent("Zed")
  .then((student) => console.log(student))
  .catch((error) => console.log(error.message));

// --- 4. Chain ---
// From getStudent("Aisha"): take the score, add 5, print the final number.

getStudent("Aisha")
  .then((student) => student.score)
  .then((score) => score + 5)
  .then((result) => console.log(result));

// --- 5. A then without return ---
// Predict: if a middle then uses braces and forgets return, what does the next then receive?
// My prediction: it will throw an error
// Correction: no error by itself. The next then receives undefined. An error only
// happens if that step then tries to use undefined (for example result.toFixed(1)).

getStudent("Aisha")
  .then((student) => student.score)
  .then((score) => {
    score + 5; // braces and no return, so this step gives back undefined
  })
  .then((result) => console.log("item 5, next then received:", result));
