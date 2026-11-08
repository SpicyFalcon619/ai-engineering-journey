// Lesson 6 basics: functions as values, from zero

// --- Step 1: defining a function vs running it ---
// Question: what is the difference between sayHi and sayHi() ?
// My answer: We use sayHi() to call the function to execute. But we use sayHi when we want to pass the function as a parameter for another function to use.

function sayHi() {
  console.log("Hi!");
}

console.log("A");
sayHi();
console.log("B");

// --- Step 2: handing a function to another function ---
// Question: what happens if you write doThreeTimes(sayHi()) instead? Predict, then try it.
// My prediction: it will print Hi! once as the function will run one time, but then throw error because we gave it function's output to run

function doThreeTimes(recipe) {
  recipe();
  recipe();
  recipe();
}

doThreeTimes(sayHi);

// --- Step 3: a timer runs your function later ---
// Question: why does B print before Hi! ?
// My answer: because sayHi function will run after a timeout, and it is 2000, but js doesn't wait for another function to finish.

console.log("A");
setTimeout(() => console.log("Hi! after 2 sec"), 2000);
console.log("B");

// --- Step 4: arrow functions ---
// a) Rewrite as an arrow function with braces and return:
//      function add(a, b) { return a + b; }
const add = (a, b) => {
  return a + b;
};

// b) Rewrite as a one-line arrow function (no braces, no return):
//      function greet(name) { return "Hi " + name; }
const greet = (name) => "Hi " + name;

// c) setTimeout with an arrow function written inline: see Step 3 above.

// d) Predict what this prints, then run it.
// My prediction: undefined
const f = (n) => {
  n * 2;
};
console.log(f(4));
