// Lesson 1c: loops

// --- 1. Print 1 to 5 ---
for (let i = 1; i <= 5; i++) {
  console.log(i);
}

// --- 2. Even numbers from 1 to 10 ---
for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) {
    console.log(i);
  }
}

// --- 3. Total of the scores ---
const scores = [82, 45, 91, 60, 38];

let total = 0; // using let because it will change with every iteration
let passed = 0;

// const and let both work here because every iteration creates a new score variable
for (const score of scores) {
  total += score;
}

// --- 4. Count of passing scores ---
for (const score of scores) {
  if (score >= 60) {
    passed++;
  }
}

console.log(`Total score = ${total} \nPassed student = ${passed}`);
