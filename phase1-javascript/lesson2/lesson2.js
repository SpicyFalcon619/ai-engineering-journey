// Lesson 2: functions

// --- 1. average (function declaration) ---
function average(numbers) {
  let total = 0;
  for (const number of numbers) {
    total += number;
  }
  return total / numbers.length;
}

console.log(average([82, 45, 91, 60, 38])); // 63.2

// --- 2. isPassing (arrow function with a default parameter) ---
const isPassing = (score, threshold = 60) => score >= threshold;

console.log(isPassing(60)); // true (default threshold 60, and 60 >= 60)
console.log(isPassing(59)); // false
console.log(isPassing(59, 50)); // true (threshold overridden)

// --- 3. applyTwice (a function that takes a function) ---
function applyTwice(fn, x) {
  return fn(fn(x));
}

const double = (n) => n * 2;

console.log(applyTwice(double, 5)); // double(double(5)) = double(10) = 20
console.log(applyTwice((n) => n + 3, 10)); // inline arrow: (10 + 3) + 3 = 16

// --- 4. Missing and extra arguments ---
// Prediction: f(1) gives NaN because b is undefined and 1 + undefined is NaN.
// Prediction: f(1, 2, 3) gives 3 because the third argument is ignored.
function f(a, b) {
  return a + b;
}

console.log(f(1));
console.log(f(1, 2, 3));
