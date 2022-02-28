const add = (x, y) => x + y;

const PI = 3.14159;

const square = x => x * x;

// console.log(module); // See that the 'module' object contains an export property which we can use to share functionality and 
// properties with other JS scripts. The 'exports' property is an empty object where you can define "importable" objects of your module  

// One way to export
// module.exports.add = add;
// module.exports.PI = PI;
// module.exports.square = square;

// Another way to export
// const math = {
//     add: add,
//     PI: PI,
//     square: square
// }

// module.exports = math;


// The module.exports object is created by the Module system. Sometimes this is not acceptable; many want their module to be an instance
// of some class. To do this, assign the desired export object to module.exports.
// Assigning the desired object to exports will simply rebind the local exports variable, which is probably not what is desired.
// For example, suppose we were making a module called a.js:

// const EventEmitter = require('events');

// module.exports = new EventEmitter();

// // Do some work, and after some time emit
// // the 'ready' event from the module itself.
// setTimeout(() => {
//   module.exports.emit('ready');
// }, 1000);

// Then in another file we could do:

// const a = require('./a');
// a.on('ready', () => {
//   console.log('module "a" is ready');
// });


// Assignment to module.exports must be done immediately. It cannot be done in any callbacks. This does not work:
// setTimeout(() => {
//     module.exports = { a: 'hello' };
//   }, 0);


// The exports variable is available within a module's file-level scope, and is assigned the value of module.exports before the module is evaluated.

// It allows a shortcut, so that module.exports.f = ... can be written more succinctly as exports.f = .... However, be aware that like any variable, if a new value is assigned to exports, it is no longer bound to module.exports:

// module.exports.hello = true; // Exported from require of module
// exports = { hello: false };  // Not exported, only available in the module

// When the module.exports property is being completely replaced by a new object, it is common to also reassign exports:

// module.exports = exports = function Constructor() {
//   // ... etc.
// };

// To illustrate the behavior, imagine this hypothetical implementation of require(), which is quite similar to what is actually done by require():

// function require(/* ... */) {
//   const module = { exports: {} };
//   ((module, exports) => {
//     // Module code here. In this example, define a function.
//     function someFunc() {}
//     exports = someFunc;
//     // At this point, exports is no longer a shortcut to module.exports, and
//     // this module will still export an empty default object.
//     module.exports = someFunc;
//     // At this point, the module will now export someFunc, instead of the
//     // default object.
//   })(module, module.exports);
//   return module.exports;
// }



// Works only when the first line below is commented, because exports is assigned a new value and it no longer references 'module.exports'
// exports = "asdsadadasqsadsaedqaw";
exports.square = square;
exports.PI = PI;