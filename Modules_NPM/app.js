// Using reusable JS code from other files - in this case, 'Math.js' in the current directory
// const math = require('./math');
// console.log(math); // If you don't 'export' anything from 'Math.js', this object will be empty {}
// You need to set 'module.exports' within 'Math.js'
// console.log(math.square(9));


const { square, PI } = require('./math');
console.log(PI);

console.log(square(9));


const cats = require('./shelter'); // Requiring code from a directory with the 'index.js' file in it. Whatever is exported from the 
// 'index.js' file within the directory will be imported into node.

console.log('REQUIRED AND ENTIRE DIRECTORY:', cats);

// RUN: node app.js

