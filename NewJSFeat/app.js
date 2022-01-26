// old way of creating defaults for function arguments

// function rollDie(numSides) {
// numSides = typeof numSides === 'undefined' ? 6 : numSides;
//     if (numSides === undefined) {
//         numSides = 6;
//     }
//     return Math.floor(Math.random() * numSides) + 1;
// }


// New way to set defauls for function parameters

// function rollDie(numSides = 6) {
//     numSides = typeof numSides === 'undefined' ? 6 : numSides;
//     return Math.floor(Math.random() * numSides) + 1;
// }


// function greet(msg = 'Hey There', person) {
//     console.log(`${msg} ${person}!`);
// }

// console.log(greet("Hello", "Joaquin"));
// console.log(greet("Joaquin"));
// console.log(greet("Hello", "Joaquin"));


// // Default Parametesr should be defined after non-default ones in the function

// function greet2(person, msg = 'Hey There') {
//     console.log(`${msg} ${person}!`);
// }


// console.log(greet2("Joaquin", "HIIII"));
// console.log(greet2("Joaquin"));
// console.log(greet2("Hello", "Joaquin"));



// SPREAD 

const max = Math.max(10, 15, 20, 32) // takes as many arguments as we want

const nums = [13, 4, 5, 21, 3, 3, 1, 2, 7, 6, 4, 2, 53456]

console.log(Math.max(nums)); // NaN

console.log(Math.max(...nums)); // 53456 - the spread syntax seperates an array into seperate arguments for the function

console.log(nums);
console.log(...nums);

console.log("Hello"); // "Hello"
console.log(..."Hello"); // spreads the string, similar to console.log('H', 'e', 'l', 'l', 'o')

const cats = ['Blue', 'Scout', 'Rocket'];
const dogs = ['Rusty', 'Wyatt'];
const allPets = [...cats, ...dogs]; // combine arrays using spread into a new array
const allAnimals = [...dogs, ...cats, 'speedy'];
console.log(allAnimals)
const msg = [..."Hello"];
console.log(msg);


const feline = { legs: 4, family: 'Felidae' };
const canine = { isFurry: true, family: 'Caninae' };
const catDog = { ...feline, ...canine, color: 'black' }; // Note that family is set to 'Caninae'. It is overwritten.
console.log(catDog);
const cateDoggo = { ...feline, ...canine, family: 'Steele' };
console.log(cateDoggo);
// Order of spread variables matters when combining objects.

const obj = { ...[2, 4, 6, 8] };
console.log(obj); // The array indices are used as keys when spreading an array into an object.
const str = { ..."Hello" };
console.log(str);


const dataFromForm = {
    email: 'blueman@gmail.com',
    password: 'tobias123',
    username: 'tfunke'
}

const newUser = { ...dataFromForm, id: 2345215, isAdmin: false };
console.log(newUser);


// REST

// Every function has an array-like object for storing the arguments passed to the function. It is built-in.
// NOTE: THE arguments OBJECT IS NOT CREATED IN THE CASE OF ARROW FUNCTION!!!

function sum() {
    console.log(arguments); // the arguments object automatically collects all the parameters passed to the function in order.
}

sum();
sum(1, 2, 4, 6, 7);

// arguments is not a regular array - reduce and other array methods cant be used on it
function sum_all() {
    return arguments.reduce((total, num) => (total + num));
}

// the rest syntax is the same as the spread syntax, but it is used on fucntion arguments to collect all parameters passed to function.
function sum_rest(...nums) {
    return nums.reduce((total, num) => (total + num));
}

function raceResults(gold, silver, ...everyoneElse) {
    console.log('GOLD MEDAL GOES TO:', gold);
    console.log('SILVER MEDAL GOES TO:', silver);
    console.log('EVERYONE ELSE:', everyoneElse);

}

raceResults('Tammy', 'Todd', 'Tina', 'Trevor', 'Travis');




// DESTRUCTURING -- unpacking/copying arrays and objects into variables


const scores = [929321, 899341, 772739, 543671, 243567, 1119343];
const [gold, silver, bronze, ...everyoneElse] = scores; // order matters in destructuring 
console.log('GOLD:', gold);
console.log('SILVER:', silver);
console.log('EVERYONE ELSE:', everyoneElse);


const user = {
    email: 'tony@gmail.com',
    password: 'jarvis',
    firstName: 'Tony',
    lastName: 'Stark',
    born: 1979,
    died: 2020,
    bio: 'Genius, Playboy, Philanthropist',
    city: 'San Francisco',
    state: 'California'
}

// const { email } = user; // equivalent to const email = user.email
const { email, firstName, lastName, city, bio } = user; // order does not matter when destructuring objects. 
const { born: birthYear, died: deathYear } = user; // equivalent to const birthYear = user.born
console.log(birthYear, deathYear);
const { height } = user;
console.log(height); // varianbles not found in the object are destructured as undefined
const { born, ht = 170, wt = 70, died } = user; // default values given to height and weight when not destructured from user.
console.log('height: ', ht);
console.log('weight: ', wt);


// destructuring function params

// function fullName(user) {
//     return `${user.firstName} ${user.lastName}`;
// }

// function fullName(user) {
//     const { firstName, lastName } = user;
//     return `${firstName} ${lastName}`;
// }
// console.log(fullName(user))

// adding defaults along with destructuring params in function

function fullName({ firstName, lastName = 'Bark' }) {
    // const { firstName, lastName } = user;
    return `${firstName} ${lastName}`;
}

console.log(fullName(user));

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


console.log(movies.filter((movie) => movie.score >= 90)); // can be re-weitten as:
console.log(movies.filter(({ score }) => score >= 90));


console.log(movies.map((movie) => (`${movie.title} (${movie.year}) is rated ${movie.score}`))); // can be re-written as:
console.log(movies.map(({ title, year, score }) => (`${title} (${year}) is rated ${score}`)));