// To use the callback and sync APIs of Node
// import * as fs from 'fs';
// Import the file system built-in module of Node
const fs = require('fs');
// console.log(fs);
const folderName = process.argv[2] || 'Project'; // directory to created taken from command-line

// This is the asynchronous way of creating directory
// Creates /tmp/a/apple, regardless of whether `/tmp` and /tmp/a exist.
// fs.mkdir('/tmp/a/apple', { recursive: true }, (err) => {
//     console.log('IN THE CALLBACK!')
//     if (err) throw err;
// });

// fs.mkdir('Dogs/Cats/hello', { recursive: true }, (err) => {
//     console.log('IN THE CALLBACK!')
//     if (err) throw err;
// });
// console.log('I COME AFTER MKDIR IN THE FILE!');

try {
    // This is the synchronous way of creating directories
    fs.mkdirSync(folderName);
    // Creating empty files synchronously - the data argument is set to ''. If you want to write somethin into the created file, the file
    // content will fall into the data argument
    fs.writeFileSync(`${folderName}/index.html`, '');
    fs.writeFileSync(`${folderName}/app.css`, '');
    fs.writeFileSync(`${folderName}/app.js`, '');
    console.log('I COME AFTER MKDIR IN THE FILE!');
} catch (e) {
    console.log('SOMETHING WENT WRONG!');
    console.log(e);
}
// RUN: node boilerplate.js <foldername>
// NOTE: THE DIRECTORY WITH EMPTY HTML,CSS AND JS FILES ARE CREATED IN THE DIRECTORY WHERE YOU RUN THE SCRIPT WITH NODE, NOT IN THE
// LOCATION OF THE SCRIPT ITSELF