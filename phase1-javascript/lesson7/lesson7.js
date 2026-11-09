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
// My prediction: start -> after calling pause -> 1 sec later

async function pause() {
  console.log("start");
  await wait(1000);
  console.log("1 second later");
}
pause();
console.log("after calling pause");

// --- 2. showScore() ---
// async function showScore(): await getStudent("Mina") and print "Mina scored 91"
// using a template literal.

async function showScore() {
  const student = await getStudent("Mina");
  console.log(`${student.name} scored ${student.score}`);
}

showScore();

// --- 3. findZed() with try / catch ---
// await getStudent("Zed") and print only the error message.
async function findZed() {
  try {
    const student = await getStudent("Zed");
    console.log(student);
  } catch (error) {
    console.error(error.message);
  }
}

findZed();

// --- 4. Aisha plus 5, as async / await ---
// Rewrite the Lesson 6 chain: take Aisha's score, add 5, print it.

async function aishaPlusFive() {
  const student = await getStudent("Aisha");
  const score = student.score + 5;

  console.log(score);
}

aishaPlusFive();

// --- 5. Forgetting await ---
// Predict: in showScore, if you remove await, what does the variable hold,
// and what does student.score give? Then check.
// My prediction: the variable will hold undefined and the student.score will give NaN
// Correction: the variable holds the promise (the box), Promise { <pending> }, and
// student.score is undefined, because a promise has no score. NaN would only appear
// after arithmetic, such as student.score + 5.

async function forgot() {
  const student = getStudent("Mina"); // no await, so this is the box, not the student
  console.log(student);
  console.log(student.score);
}

forgot();
