for (let i = 0; i < 10; i++) {
    console.log('HELLO FROM FIRST SCRIPT!!!!');
}

// USE 'node firstScript.js' in terminal to execute this through node.
// REMEMBER: NodeJS does not have the 'document' and 'window' objects. instead it has the global object where many common JS features
// like setTimeout() are defined

// console.log(document);
// console.log(window);
console.log(global);

// Using the Node 'Process' object
console.log(process);
console.log(process.version);
console.log(process.release);
console.log(process.cwd());  // current working directory