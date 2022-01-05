// singSong();
// singSong();
// singSong();
// singSong();
// singSong();
// singSong();
// singSong();
// singSong();
// singSong();
// singSong();
// singSong();



// function singSong() {
//     console.log("DO");
//     console.log("RE");
//     console.log("MI");
// }

// function greet(firstName, lastName) {
//     console.log(`Hey there, ${firstName} ${lastName[0]}`);
// }

// function repeat(str, numTimes) {
//     let result = '';
//     for (let i = 0; i < numTimes; i++) {
//         result += str;
//     }
//     console.log(result);
// }


// function add(x, y) {
//     if (typeof x !== 'number' || typeof y !== 'number') {
//         return false;
//     }
//     return x + y;
//     console.log('END OF FUNCTION!!!'); // Never RUNS
// }

// let bird = 'Scarlet Macaw';
// function birdWatch() {
//     let bird = 'Great Blue Heron';
//     console.log(bird);
// }
// console.log(bird);
// birdWatch();
// console.log(bird);



// let totalEggs = 0;
// function collectEggs() {
//     totalEggs = 6; // Modify Global Variable
// }
// console.log(totalEggs);
// collectEggs();
// console.log(totalEggs);


// BLOCK SCOPE
// let radius = 8;
// if (radius > 0) {
//     const PI = 3.14159;
//     let msg = 'HIII!';
// }
// console.log(radius);
// console.log(PI);


// var is SCOPED OUTSIDE BLOCK ALSO
// for (var i = 0; i < 5; i++) {
//     var msg = 'ASADDSADQWEE';
//     console.log(msg);
// }
// console.log(msg);


// LEXICAL SCOPING - IN NESTED FUNCTIONS, THE INNER FUNCTIONS HAVE ACCESS TO THE VARIABLES OF THE OUTER PARENT/GRANDPARENT FUNCTIONS.
// color is accesible only to inner() and cryForHelp()
// function bankRobbery() {
//     const heroes = ['Spiderman', 'Wolverine', 'Black Panther', 'Batwoman'];
//     function cryForHelp() {
//         let color = 'purple';
//         function inner() {
//             for (let hero of heroes) {
//                 console.log(`Please help us, ${hero.toUpperCase()} `);

//             }
//         }
//         inner();
//     }
//     cryForHelp();
// }

// bankRobbery();





// FUNCTION EXPRESSION - STORING FUNCTIONS IN VARIABLES
// normal function
// function add(x, y) {
//     return x + y;
// }

// ERROR - function needs to be associated with an identifier
// function (x, y) {
//     return x + y;
// }


// function expression - saving functions as variables
// functions can be stored and passed around like any other value
// const add = function (x, y) {
//     return x + y;
// }
// console.log(add(2, 3));



// HIGHER ORDER FUNCTIONS - FUNCTIONS THAT OPERATE ON OTHER FUNCTIONS
// Keep in mind function argument must be defined as a proper function before the higher order function can be called on it.
// Otherwise, ERROR.
// function callTwice(func) {
//     func();
//     func();
// }

// The argument function is defined before the higher-order function is used on it.
// let rollDie = function () {
//     const roll = Math.floor(Math.random() * 6) + 1;
//     console.log(roll);
// }

// callTwice(rollDie);


// function callTenTimes(func) {
//     for (let i = 0; i < 10; i++) {
//         func();
//     }
// }

// let rollDie = function () {
//     const roll = Math.floor(Math.random() * 6) + 1;
//     console.log(roll);
// }

// callTenTimes(rollDie);


//You can also return function from a higher - order function and capture it into a variable
// function makeMysteryFunc() {
//     const rand = Math.random();
//     if (rand > 0.5) {
//         return function () {
//             console.log('CONGRATZ, I AM A GOOD FUNCTION!');
//         }
//     }
//     else {
//         return function () {
//             alert('YOU HAVE BEEN INFECTED BY A VIRUS!!!!');
//             alert('STOP TRYING TO CLOSE THIS WINDOW!!!');
//             alert('STOP TRYING TO CLOSE THIS WINDOW!!!');
//             alert('STOP TRYING TO CLOSE THIS WINDOW!!!');
//             alert('STOP TRYING TO CLOSE THIS WINDOW!!!');
//             alert('STOP TRYING TO CLOSE THIS WINDOW!!!');
//             alert('STOP TRYING TO CLOSE THIS WINDOW!!!');
//             alert('STOP TRYING TO CLOSE THIS WINDOW!!!');
//         }
//     }
// }

// const mystery = makeMysteryFunc();
// mystery();




function makeBetweenFunc(min, max) {
    return function (num) {
        return num >= min && num <= max;
    }
}

