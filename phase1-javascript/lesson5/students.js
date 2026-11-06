// Lesson 5: students.js
// Item 4: one default export and one named export

const students = [
  { name: "Aisha", score: 82, tags: ["ml", "python"] },
  { name: "Rahim", score: 45, tags: ["web"] },
  { name: "Mina", score: 91, tags: ["ml", "js", "react"] },
  { name: "Noman", score: 99, tags: ["ml", "java", "python"] },
];

// Default export: the main thing this file provides.
export default students;

// Named export: returns the names of the students with score >= 60.
export function getPassing(list) {
  return list.filter((s) => s.score >= 60).map((s) => s.name);
}
