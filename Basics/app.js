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




// function makeBetweenFunc(min, max) {
//     return function (num) {
//         return num >= min && num <= max;
//     }
// }

// const isChild = makeBetweenFunc(0, 18)
// const isAdult = makeBetweenFunc(18, 64)
// const isSenior = makeBetweenFunc(65, 120)



// METHODS

const myMath = {
    PI: 3.14159,
    square: function (num) {
        return num * num;
    },
    cube(num) {
        return num * num * num;
    }
}


// THIS KEYWORD DEPENDS ON THE CONTEXT OF INVOCATION

// const cat = {
//     name: 'Subramani',
//     color: 'Black',
//     breed: 'Bombay Cat',
//     meow() {
//         console.log(`${this.name} says MEOW!`);
//     }
// }


// const meow2 = cat.meow;


// const cat = {
//     name: 'Subramani',
//     color: 'Black',
//     breed: 'Bombay Cat',
//     meow() {
//         console.log("THIS IS: ", this);
//     }
// }


// const meow2 = cat.meow;


// ALL DEFINED FUNCTIONS ARE STORED AS METHODS IN THE "window"TOP LEVEL OBJECT



// hello.toUpperCase();
// console.log("AFTER!!");


// THE TRY-CATCH BLOCK

// try {
//     hello.toUpperCase();
// } catch {
//     console.log("ERROR!!!");
// }
// console.log("AFTER!!");

// function yell(msg) {
//     try {
//         console.log(msg.toUpperCase().repeat(3));
//     } catch (e) {
//         console.log("Please pass a String next time!");
//     }

// }



// ARRAY METHODS:



// const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
// numbers.forEach(function (element) {
//     if (num % 2 === 0) {
//         console.log(element);
//     }

// })



// SIMILAR TO

// const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
// for (let el of numbers) {
//     console.log(el);
// }



// const movies = [
//     {
//         title: 'Amadeus',
//         score: 99
//     },
//     {
//         title: 'Stand By Me',
//         score: 85
//     },
//     {
//         title: 'Parasite',
//         score: 95
//     },
//     {
//         title: 'Alien',
//         score: 90
//     },
// ]

// movies.forEach(function (movie) {
//     console.log(`${movie.title} - ${movie.score}/100`);
// })



//  MAP METHOD:

// const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

// const doubles = numbers.map(function (num) {
//     return num * 2;
// })



// const movies = [
//     {
//         title: 'Amadeus',
//         score: 99
//     },
//     {
//         title: 'Stand By Me',
//         score: 85
//     },
//     {
//         title: 'Parasite',
//         score: 95
//     },
//     {
//         title: 'Alien',
//         score: 90
//     },
// ]

// const titles = movies.map(function (movie) {
//     return movie.title.toUpperCase();
// })





// ARROW FUNCTIONS:


// const add = (x, y) => {
//     return x + y;
// }

// // when you have only a single argument for the function:
// const square = x => {
//     return x * x;
// }


// // Implicit return function - This syntax only works when the function has a single statement
// const rollDie = () => (Math.floor(Math.random() * 6) + 1);

// const addition = (x, y) => x + y;
// const isEven = num => num % 2 === 0;




// const movies = [
//     {
//         title: 'Amadeus',
//         score: 99
//     },
//     {
//         title: 'Stand By Me',
//         score: 85
//     },
//     {
//         title: 'Parasite',
//         score: 95
//     },
//     {
//         title: 'Alien',
//         score: 90
//     },
// ]

// const movieRatings = movies.map(movie => (`${movie.title} : ${movie.score / 10}`));


// SCHEDULING FUNCTIONS

//3s timeout
// console.log("HELLOOOOOOO")
// setTimeout(() => {
//     console.log(".... are you still there ?");
// }, 3000)


// repeat function over set intervals of time - 3s in this case.
// const id = setInterval(() => { console.log(Math.random()); }, 3000);
// use clearInterval(id) to stop this function from repeating.


// FILTER FUNCTION

// const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

// const filtNums = numbers.filter(n => {
//     return n === 4;
// })

const movies = [
    {
        title: 'Amadeus',
        score: 99,
        year: 1984
    },
    {
        title: 'Sharknado',
        score: 35,
        year: 2013
    },
    {
        title: '13 Going on 30',
        score: 70,
        year: 2004
    },
    {
        title: 'Stand By Me',
        score: 85,
        year: 1986
    },
    {
        title: 'Waterworld',
        score: 62,
        year: 1995
    },
    {
        title: 'Jingle All The Way',
        score: 71,
        year: 1996
    },
    {
        title: 'Parasite',
        score: 95,
        year: 2019
    },
    {
        title: 'Notting Hill',
        score: 77,
        year: 1999
    },
    {
        title: 'Alien',
        score: 90,
        year: 1979
    }
]

// const badMovies = movies.filter(movie => movie.score < 70);
// const recentMovies = movies.filter(m => m.year > 2000);
// const goodTitles = movies.filter(movie => movie.score > 80).map(m => m.title);



// BOOLEAN METHODS - EVERY AND SOME

const exams = [80, 98, 92, 78, 72, 90, 89, 84, 81, 77];

// console.log('Is every score in exams above 75: ', exams.every(score => score >= 75));
// console.log('Is any score in exams above 75: ', exams.some(score => score >= 75));

// console.log('Are there any movies that released after year 2015?: ', movies.some(movie => movie.year > 2015))



// REDUCE FUNCTION


const prices = [9.99, 1.50, 19.99, 49.99, 30.5]

let total = 0;
for (let price of prices) {
    total += price;
}
console.log(total);

const total_reduce = prices.reduce((total, price) => total + price);

const minPrice = prices.reduce((min, price) => {
    if (price < min) { return price; }
    else { return min; }
})

const maxPrice = prices.reduce((max, price) => {
    if (price > max) { return price; }
    else { return max; }
})

const bestMovie = movies.reduce((bestMovie, currMovie) => {
    if (currMovie.score > bestMovie.score) { return currMovie; }
    else { return bestMovie; }
})


const evens = [2, 4, 6, 8]

evens.reduce((sum, num) => (sum + num)) // 20
evens.reduce((sum, num) => (sum + num), 100) // set starting point of Accumulator to 100 = 120
evens.reduce((sum, num) => (sum + num), 40) // set starting point of Accumulator to 40 = 60



// ARROW FUNCTIONS AND 'this' KEYWORD:


const person = {
    firstName: 'Viggo',
    lastName: 'Mortensen',
    fullName: function () {
        return `${this.firstName} ${this.lastName} `;
    }
}

console.log('Person name with normal function: ', person.fullName()); // everything looks normal with a traditional function


const person2 = {
    firstName: 'Viggo',
    lastName: 'Mortensen',
    fullName: () => (`${this.firstName} ${this.lastName} `)
}

console.log('Person name with arrow function: ', person2.fullName()); // undefined with arrow function


// setTimeout is a window object method

const person3 = {
    firstName: 'Viggo',
    lastName: 'Mortensen',
    fullName: () => (`${this.firstName} ${this.lastName} `),
    shoutName: function () {
        setTimeout(function () {
            console.log(this);
            console.log(this.fullName());
        }, 3000);
    },
    shoutName2: function () {
        setTimeout(() => {
            console.log(this);
            console.log(this.fullName());
        }, 3000)
    }
}

console.log('person3.shoutName uses "this" keyword in a normal function: ', person3.shoutName()); // errors out with normal function for normal function "shoutName"
setTimeout(() => (console.log('person3.shoutName2 uses "this" keyword inside arrow function: ', person3.shoutName2())), 3500) // prints undefined undefined for arrow function calling this.fullName