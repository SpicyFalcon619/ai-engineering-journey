// Lesson 4 (part 1): map, filter, find

const scores = [82, 45, 91, 60, 38];
const students = [
    { name: "Aisha", score: 82, tags: ["ml", "python"] },
    { name: "Rahim", score: 45, tags: ["web"] },
    { name: "Mina", score: 91, tags: ["ml", "js", "react"] },
    { name: "Noman", score: 99, tags: ["ml", "java", "python"] },
];

// --- 1. map: add 5 to every score ---
const updated = scores.map((s) => s + 5);
console.log(`Original: ${scores}\nUpdated: ${updated}`);

// --- 2. filter: scores of 60 or more ---
const passed = scores.filter((s) => s >= 60);
console.log(`Passed: ${passed}`);

// --- 3. map: just the names ---
const names = students.map((st) => st.name);
console.log(`Names: ${names}`);

// --- 4. find: a student that exists, and one that does not ---
const mina = students.find((st) => st.name === "Mina");
console.log(mina);

const random = students.find((st) => st.name === "Abul");
console.log(random); // undefined, because find returns undefined when nothing matches

// --- 5. filter then map: passed and has the "ml" tag ---
// Both checks go in the same filter callback, while the
// items are still student objects. map comes last to pull out the names.
const passedMl = students
    .filter((st) => st.score >= 60 && st.tags.includes("ml"))
    .map((st) => st.name);
console.log(passedMl);

// --- 6. map without return ---
// Braces mean a block of statements, so without `return` the callback gives back undefined.
console.log(
    scores.map((s) => {
        s * 2;
    }),
); // undefined x 5
