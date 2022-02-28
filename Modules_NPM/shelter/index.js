// Require the exported object from all three Cat files 
// The name 'index.js' has special meaning in node. When you require code from an entire directory, node is going to look for this
// 'index.js' file in that directory, and whatever this 'index.js' file exports, will be imported from the directory by node.
const blue = require('./blue');
const sadie = require('./sadie');
const janet = require('./janet');

const allCats = [blue, sadie, janet];
// Commented the below sanity-check line because it will be printed when the entire directory is required.
// console.log(allCats);
module.exports = allCats;

// RUN: node index.js