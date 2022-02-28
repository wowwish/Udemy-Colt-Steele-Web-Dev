// Install packages locally in a directory before using them in a script
// installing using 'npm init' and then 'npm install <package name>'


// requiring package 'give-me-a-joke'
const jokes = require('give-me-a-joke');
// console.dir(jokes);
// Use the functions imported from 'give-me-a-joke' package to print jokes to the console 
jokes.getRandomDadJoke(function (joke) {
    console.log(joke);
})


// RUN: node index.js