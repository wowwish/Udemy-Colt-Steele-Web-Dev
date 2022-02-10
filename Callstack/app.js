const multiply = (x, y) => (x * y);

const square = x => multiply(x, x);

const isRightTriangle = (a, b, c) => (square(a) + square(b) === square(c));

// isRightTriangle makes multiple calls of square which in itself calls multiple
// multiply(3,3) is executed first, then square(3), then multiply(4,4),
// then square(4), then multiply(5,5), then square(5)
// and finally isRightTriangle(3,4,5)
// Check this out in Chrome - Go to Sources in the Dev Console
// Click on app.js - the script
// add a breakpoint at the isRightTriangle call below by clicking on the line number
// Now the execution will be paused at the isRightTriangle function call below when you reload the page
// Use the arrow keys at the top of the right side pane to step into the function calls
// check the call stack and see how function calls are added to it as you stpe into the stack
// Also check how the values of the local variables, return value change in the scope panel

console.log('DONE')

isRightTriangle(3, 4, 5);

console.log('DONE');