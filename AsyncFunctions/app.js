// async function - a newer and cleaner syntax for working with async Code 
// syntax "makeup" for proimses
// async functions always return a promise, if the function returns a value, the promise will be resolved with that value
// If the function throws an exception, the promise will be rejected


// An empty async function is resolved as undefined
// async function hello() {

// }
// console.log(hello());


// Promise resolved with 'LA LA LA LA' - arrow function with async
// const sing = async () => {
//     return 'LA LA LA LA';
// }

// console.log(sing());

// sing().then((data) => {
//     console.log('promise resolved with:', data);
// })




//  Promise rejected with an error (Ignore the uncaught exception error)
// const sing = async () => {
//     throw new Error("UH OH");
// }
// const sing2 = async () => {
//     throw "OH NO, PROBLEM";
// }

// console.log(sing());
// console.log(sing2());

// sing()
//     .then(() => {
//         console.log('PROMISE RESOLVED WITH: ', data);
//     })
//     .catch((err) => {
//         console.log('OH NO, PROMISE REJECTED!');
//         console.log(err);
//     })

// Async function for logging in
const login = async (username, password) => {
    if (!username || !password) throw 'Missing Credentials!';
    if (password == 'corgiarecute') return 'WELCOME';
    throw 'Invalid Password!';
}

// Unsuccessful login
login('dasdasd')
    .then(msg => {
        console.log('LOGGED IN');
        console.log(msg);
    })
    .catch(err => {
        console.log('ERROR!');
        console.log(err);
    })

// Successful login
login('dasdasd', 'corgiarecute')
    .then(msg => {
        console.log('LOGGED IN');
        console.log(msg);
    })
    .catch(err => {
        console.log('ERROR!');
        console.log(err);
    })

// Note that the output of the two login() calls need not follow the execution order because they are asynchronous




const delayedColorChange = (color, delay) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            document.body.style.backgroundColor = color;
            resolve();
        }, delay)
    })
}

// delayedColorChange('red', 1000)
//     .then(() => delayedColorChange('orange', 1000))
//     .then(() => delayedColorChange('yellow', 1000))
//     .then(() => delayedColorChange('green', 1000))
//     .then(() => delayedColorChange('blue', 1000))
//     .then(() => delayedColorChange('indigo', 1000))
//     .then(() => delayedColorChange('violet', 1000));


// We can use the await keyword inside functions declared with async
// await will pause the execution of the function, WAITING FOR A PROMISE TO BE RESOLVED
async function rainbow() {
    // The function calls below wait for the promise within delayedColorChange to be resolved before the next function call.
    await delayedColorChange('red', 1000)
    console.log('HI!!') // runs only after the first promise is resolved
    await delayedColorChange('orange', 1000)
    await delayedColorChange('yellow', 1000)
    await delayedColorChange('green', 1000)
    await delayedColorChange('blue', 1000)
    await delayedColorChange('indigo', 1000)
    await delayedColorChange('violet', 1000)
    return "ALL DONE!"
}

// rainbow()
//     .then(() => console.log("END OF RAINBOW!"))


// prints after the rainbow() call promise is resolved
async function printRainbow() {
    await rainbow();
    console.log('END OF RAINBOW!');
}




const fakeRequest = (url) => {
    return new Promise((resolve, reject) => {
        const delay = Math.floor(Math.random() * (4500)) + 500;
        setTimeout(() => {
            if (delay > 4000) {
                reject('Connection Timeout :(');
            } else {
                resolve(`Here is your fake data from ${url}`);
            }
        })
    })
}

// // When the async function returns nothing, the promise is resolved with undefined.
// async function makeTwoRequests() {
//     // If the function fakeRequest is resolved, the value from resolve(value) will be stored in data1
//     // Uncaught exception error pops up when the fakeRequest call is rejected 
//     let data1 = await fakeRequest('/page1');
//     console.log(data1);
// }

// // Call this function from the console to see the promise object and its resolution/rejection status
// makeTwoRequests();

// We can use try - catch blocks to handle rejection from fakeRequest 
async function makeTwoRequests() {
    try {
        let data1 = await fakeRequest('/page1');
        console.log(data1);
        let data2 = await fakeRequest('/page2');
        console.log(data2);
    } catch (e) {
        // This catch block is common for both the fakeRequest calls. Either call1 resolves and call2 rejects, 
        // or call1 rejects, or both calls resolve
        console.log('caught and ERROR!');
        console.log('ERROR is: ', e);
    }
}

// call the makeTwoRequests function from the console to view the promise objects and their resolution/rejection status
makeTwoRequests();