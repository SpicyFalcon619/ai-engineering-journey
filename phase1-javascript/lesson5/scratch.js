// Lesson 5, item 6: this file fails on purpose. Run it to see the error.
// Result: SyntaxError: The requested module './students.js' does not provide an export named 'students'
// Braces ask for a NAMED export, but students is the DEFAULT export.

import { students } from "./students.js";
/// @error
