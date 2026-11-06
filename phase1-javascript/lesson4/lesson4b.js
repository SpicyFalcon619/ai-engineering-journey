// Lesson 4 (part 2): some, every, reduce, sort

const scores = [82, 45, 91, 60, 38];
const students = [
  { name: "Aisha", score: 82, tags: ["ml", "python"] },
  { name: "Rahim", score: 45, tags: ["web"] },
  { name: "Mina", score: 91, tags: ["ml", "js", "react"] },
  { name: "Noman", score: 99, tags: ["ml", "java", "python"] },
];

// --- 1. some and every ---
// Is any score above 90? Did everyone score at least 40? Print both.
// Print the booleans so both answers always show up.
console.log("Anyone above 90?", scores.some((s) => s > 90)); // true
console.log("Everyone at least 40?", scores.every((s) => s >= 40)); // false, because of 38

// --- 2. reduce: total and average ---
const total = scores.reduce((sum, s) => sum + s, 0);
console.log(total); // 316

// average = total divided by how many scores there are
const average = total / scores.length;
console.log(average); // 63.2

// --- 3. reduce: the highest score (no Math.max) ---
// No starting value, so reduce starts with the first item. That works here,
// but it would throw on an empty array.
const max = scores.reduce((highest, s) => {
  return s > highest ? s : highest;
});
console.log(max);

// --- 4. sort: scores in descending order, without changing the original ---
// Print both the sorted copy and the original.
const sortedScores = [...scores].sort((a, b) => b - a);
console.log(scores);
console.log(sortedScores);

// --- 5. sort the students from highest to lowest score, print only the names ---
const sortedStudents = [...students]
  .sort((a, b) => b.score - a.score)
  .map((s) => s.name);
console.log(students.map((s) => s.name));
console.log(sortedStudents);

// --- 6. Predict, then check ---
// What does console.log([100, 25, 3].sort()); print? Write your prediction here first.
// Default sort compares as text: "100" < "25" < "3", so the order does not change.
console.log([100, 25, 3].sort()); // [100, 25, 3]
