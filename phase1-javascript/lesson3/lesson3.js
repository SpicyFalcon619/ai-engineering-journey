// Lesson 3: objects, arrays, destructuring and spread

// ===== Warm-ups =====

// A
const p = { x: 1, y: 2, z: 3 };
const { x, y: z } = p;
console.log(x, z);

// B
const nums = [10, 20, 30];
const [a, b] = nums;
console.log(a, b);

// C
const base = [1, 2];
const more = [...base, 3];
console.log(base, more);

// D
const o = { a: 1, b: 2 };
const o2 = { ...o, b: 99, c: 3 };
console.log(o, o2);

// ===== Exercise 5 =====

const students = [
  { name: "Aisha", score: 82, tags: ["ml", "python"] },
  { name: "Rahim", score: 45, tags: ["web"] },
  { name: "Mina", score: 91, tags: ["ml", "js", "react"] },
];

// --- 1. Tag and last student ---
console.log(students.at(-1).name, students.at(-1).tags[1]);

// --- 2. Destructure name and score ---
const { name, score } = students[0];

console.log(`Name: ${name}, Score: ${score}`);

// --- 3. Copy with a changed score (spread) ---
const student1 = { ...students[1], score: 70 };

console.log(students[1]); // original, score is still 45
console.log(student1); // the copy, score is 70

// --- 4. push onto a const array ---
// const only stops the name `students` from being
// reassigned. push changes the contents of the same array, so it is allowed.
students.push({ name: "Noman", score: 99, tags: ["ml", "java", "python"] });

console.log(students);

// --- 5. describe (destructuring in the parameters) ---
const describe = ({ name, score, tags }) => `${name}: ${score}: ${tags}`;

console.log(describe(students[0]));

// --- 6. sum with a rest parameter ---
// ...nums gathers every argument into one array.
function sum(...nums) {
  let total = 0;
  for (const n of nums) {
    total += n;
  }
  return total;
}

console.log(sum(1, 2, 3, 4)); // 10
console.log(sum(5)); // 5
console.log(sum()); // 0
