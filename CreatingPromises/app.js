// A promise expects us to pass a function wth two parameters - resolve and reject 
// they represent the resolution and rejection of our promise 


// A resolved Promise
console.log(new Promise((resolve, reject) => {
    resolve();
}))

// A rejected promise - will show an uncaught promise error
console.log(new Promise((resolve, reject) => {
    reject();
}))

// A pending promise
console.log(new Promise((resolve, reject) => {

}))

// A Promise that always resolves after 1 second.
// const fakeRequest = (url) => {
//     return new Promise((resolve, reject) => {
//         const rand = Math.random();
//         setTimeout(() => {
//             if (rand < 0.7) {
//                 // Promise is resolved and 'YOUR FAKE DATA HERE' is returned as value to .then()
//                 resolve('YOUR FAKE DATA HERE');
//             }
//             // Promise is rejected and 'Request Error!' is returned as value to .catch()
//             reject('Request Error!');
//         }, 1000)
//     })
// }

// fakeRequest('dogs/1')
//     .then((data) => {
//         console.log('DONE WITH REQUEST!')
//         console.log('data is', data)
//     })
//     .catch((err) => {
//         console.log('OH NO!', err);
//     })



// const delayedColorChange = (newColor, delay, doNext) => {
//     setTimeout(() => {
//         document.body.style.backgroundColor = newColor;
//         doNext && doNext();
//     }, delay)
// }

// delayedColorChange('red', 1000, () => {
//     delayedColorChange('orange', 1000, () => {
//         delayedColorChange('yellow', 1000, () => {
//             delayedColorChange('green', 1000, () => {
//                 delayedColorChange('blue', 1000, () => {
//                     delayedColorChange('indigo', 1000, () => {
//                         delayedColorChange('violet', 1000)
//                     })
//                 })
//             })
//         })
//     })
// })



// Using Promises to write cleaner code
const delayedColorChange = (color, delay) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            document.body.style.backgroundColor = color;
            resolve();
        }, delay)
    })
}

delayedColorChange('red', 1000)
    .then(() => delayedColorChange('orange', 1000))
    .then(() => delayedColorChange('yellow', 1000))
    .then(() => delayedColorChange('green', 1000))
    .then(() => delayedColorChange('blue', 1000))
    .then(() => delayedColorChange('indigo', 1000))
    .then(() => delayedColorChange('violet', 1000));