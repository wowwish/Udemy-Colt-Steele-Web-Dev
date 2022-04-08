// Created 'package.json' with 'npm init'
// installed 'figlet' and 'colors' packages locally
// The dependency property in 'package.json' was update automatically after installation
// Note that the dependencies in package.json also have a version number associated with them. When the version number starts with
// Allows changes that do not modify the left-most non-zero element in the [major, minor, patch] tuple. In other words, this allows 
// patch and minor updates for versions 1.0.0 and above, patch updates for versions 0.X >=0.1.0, and no updates for versions 0.0.X.
// NPM docs on package.json: https://docs.npmjs.com/cli/v8/configuring-npm/package-json#dependencies
// The figlet package creates ASCII art from text
// RUN: node index.js


const figlet = require('figlet');
const colors = require('colors');

figlet('Hello World!!', function (err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data.green); // Using string prototype extensions from the 'colors' package (https://www.npmjs.com/package/colors) 
});