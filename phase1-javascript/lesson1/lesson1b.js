// Lesson 1b: comparison and if / else if / else

// --- Temperature chain ---
const temperature = 31;

if (temperature > 30) {
  console.log("Hot");
} else if (temperature >= 20 && temperature <= 30) {
  console.log("Warm");
} else {
  console.log("Cold");
}

// --- Predictions ---
console.log(10 === "10"); // false
console.log(10 == "10"); // true
console.log(true && false); // false
console.log(!false); // true
