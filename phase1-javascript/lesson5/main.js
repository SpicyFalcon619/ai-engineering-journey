// Lesson 5: main.js
// Run it with: node main.js (from inside the lesson5 folder)

// Imports go at the top of the file.
import { add, multiply, TAX_RATE as taxRate } from "./mathUtils.js";
import students, { getPassing } from "./students.js";

// --- 2. Import named exports ---
// Print add(2, 3) and multiply(4, 5).
console.log(add(2, 3), multiply(4, 5));

// --- 3. Import with a rename ---
// TAX_RATE is imported as taxRate. Print 100 * taxRate.
console.log(100 * taxRate);

// --- 5. Import the default export and a named export ---
// Print the names of the passing students.
console.log(getPassing(students));

// --- 6. Predict, then check ---
// See scratch.js. Importing { students } with braces fails, because students
// is the default export: "does not provide an export named 'students'".
