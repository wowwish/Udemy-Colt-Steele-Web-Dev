// Install packages locally in a directory before using them in a script
// The packages will be installed inside a new sub directory called 'node_modules'
// the 'npm init' command creates a 'package.json' file by asking for details from the command-line
// When you install node packages, this 'package.json' file will have its dependencies updated automatically.
// You may want to create the 'package.json' file using 'npm init' to keep the details of your installed packages
// in 'node_modules'.
// Installation: use 'npm install <package name>'
// This installs the package locally and you can only require() the package from 
// JS scripts within the same directory where you install the package

// You can also install packages in the global scope, if you want to require() the package from anywhere
// HOWEVER, INSTALLING PACKAGES GLOBALLY IS BAD PRACTICE AND NOT RECOMMENDED BECAUSE OF VERSION CONFLICTS AND OTHER ISSUES.
// ONLY COMMAND-LINE TOOL PACKAGES ARE INSTALLED GLOBALLY
// Use 'npm install -g <package_name>' for installation of package in the global scope.

// For permission issues in installation directory, run 'sudo chown $USER <directory>'
// Finally, you can create the symlink by running 'npm link <package_name>' in your project directory

// requiring package 'give-me-a-joke'
const jokes = require('give-me-a-joke');
const colors = require('colors');
// const cowsay = require('cowsay'); // throws error - unlinked global package
colors.enable();
// console.dir(jokes);
// Use the functions imported from 'give-me-a-joke' package to print jokes to the console.
// Use the String.Prototype extensions from colors (shortcut) or call methods directly from colors to format the displayed joke
jokes.getRandomDadJoke(function (joke) {
    // Shortcut using String.Prototype extension
    // console.log(joke.rainbow);
    // Using method call
    console.log(colors.rainbow(joke));
})


// RUN: node index.js