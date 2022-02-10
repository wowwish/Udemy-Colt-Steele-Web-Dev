// console.log('Sending request to Server');
// setTimeout(() => {
//     console.log('Here is your data from the server');
// }, 3000)

// console.log('I am at the end of the file');

// OUTPUT:
// Sending request to Server
// I am at the end of the file
// Here is your data from the server


// Browsers come with Web APIs that are able to handle certain tasks in the background (like making requests or setTimeout)
// The JS call stack recognizes these Web API functions and passes them off to the Browser to take care of
// Once the Browser finishes those tasks, they return and are pushed onto the stack as a Callback
// In this code snippet, the Browser waits for 3 seconds before executing the function within setTimeout.
// After 3 seconds, the function is executed and sent to the Call Back queue and it returns back to the Call Stack from there



// In this code snippet, Both functions are executed after one second. Only the orange colour is seen
// The red colour change happens within a very short timeframe as it is immediately turned into orange
// setTimeout(() => {
//     document.body.style.backgroundColor = 'red';
// }, 1000)

// setTimeout(() => {
//     document.body.style.backgroundColor = 'orange';
// }, 1000)



// This code snipped solves the transition problem by cumulatively adding time for setTimeout from the Previous calls
// setTimeout(() => {
//     document.body.style.backgroundColor = 'red';
// }, 1000)

// setTimeout(() => {
//     document.body.style.backgroundColor = 'orange';
// }, 2000)

// setTimeout(() => {
//     document.body.style.backgroundColor = 'yellow';
// }, 3000)



// Nested implementation
// setTimeout(() => {
//     document.body.style.backgroundColor = 'red';
//     setTimeout(() => {
//         document.body.style.backgroundColor = 'orange';
//         setTimeout(() => {
//             document.body.style.backgroundColor = 'yellow';
//             setTimeout(() => {
//                 document.body.style.backgroundColor = 'green';
//                 setTimeout(() => {
//                     document.body.style.backgroundColor = 'blue';
//                 }, 1000)
//             }, 1000)
//         }, 1000)
//     }, 1000)
// }, 1000)



const delayedColourChange = (newColour, delay, doNext) => {
    setTimeout(() => {
        document.body.style.backgroundColor = newColour;
        doNext && doNext(); // If doNext is undefined (it does not have a value assigned to it in the function call) it will not be executed
    }, delay)
}

delayedColourChange('red', 1000, () => {
    delayedColourChange('orange', 1000, () => {
        delayedColourChange('yellow', 1000, () => {
            delayedColourChange('green', 1000, () => {
                delayedColourChange('blue', 1000)
            })
        })
    })
})




// A typical function to handle callbacks and failures
// searchMoviesAPI('amadeus', () => {
//     saveToMyDB(movies, () => {
//         // if it works run this
//     }, () => {
//         // if it does not work run this
//     }, () => {
//         // if API is down or request failed, run this
//     })
// })