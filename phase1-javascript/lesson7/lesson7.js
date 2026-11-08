// Lesson 7: async / await
//
// Reminder: await means "pause this function until the promise's button is pressed,
// then give me what was inside". It can only be used inside an async function.

const students = [
  { name: "Aisha", score: 82, tags: ["ml", "python"] },
  { name: "Rahim", score: 45, tags: ["web"] },
  { name: "Mina", score: 91, tags: ["ml", "js", "react"] },
  { name: "Noman", score: 99, tags: ["ml", "java", "python"] },
];

// From Lesson 6 (already written, so the focus here is the new syntax)
const wait = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
};

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

// --- 1. pause() ---
// async function pause(): print "start", await wait(1000), then print "1 second later".
// Call pause(), and on the very next line print "after calling pause".
// Predict the order of the three prints first.
// My prediction:
// TODO

// --- 2. showScore() ---
// async function showScore(): await getStudent("Mina") and print "Mina scored 91"
// using a template literal.
// TODO

// --- 3. findZed() with try / catch ---
// await getStudent("Zed") and print only the error message.
// TODO

// --- 4. Aisha plus 5, as async / await ---
// Rewrite the Lesson 6 chain: take Aisha's score, add 5, print it.
// TODO

// --- 5. Forgetting await ---
// Predict: in showScore, if you remove await, what does the variable hold,
// and what does student.score give? Then check.
// My prediction:
// TODO
