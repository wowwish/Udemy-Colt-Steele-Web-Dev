// The Promise object represents the eventual completion (or failure) of an asynchronous operation and its resulting value.
// A Promise is a proxy for a value not necessarily known when the promise is created. 
// It allows you to associate handlers with an asynchronous action's eventual success value or failure reason. 
// This lets asynchronous methods return values like synchronous methods: instead of immediately returning the final value, 
// the asynchronous method returns a promise to supply the value at some point in the future.


// Once a Promise is fulfilled or rejected, the respective handler function (onFulfilled or onRejected) 
// will be called asynchronously (scheduled in the current thread loop). 
// The behavior of the handler function follows a specific set of rules. If a handler function:

//  * returns a value, the promise returned by then gets resolved with the returned value as its value.
//  * doesn't return anything, the promise returned by then gets resolved with an undefined value.
//  * throws an error, the promise returned by then gets rejected with the thrown error as its value.
//  * returns an already fulfilled promise, the promise returned by then gets fulfilled with that promise's value as its value.
//  * returns an already rejected promise, the promise returned by then gets rejected with that promise's value as its value.
//  * returns another pending promise object, the resolution/rejection of the promise returned by then will be subsequent to the 
//  * resolution/rejection of the promise returned by the handler. Also, the resolved value of the promise returned by then will be 
//  * the same as the resolved value of the promise returned by the handler.



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


// A typical callback request function
const fakeRequestCallback = (url, success, failure) => {
    const delay = Math.floor(Math.random() * 4500) + 500;
    setTimeout(() => {
        if (delay > 4000) {
            failure('Connection Timeout! :(');
        } else {
            success(`Here is your fake data from ${url}`);
        }
    }, delay)
}


// callback request function using promises
const fakeRequestPromise = (url) => {
    return new Promise((resolve, reject) => {
        const delay = Math.floor(Math.random() * 4500) + 500;
        setTimeout(() => {
            if (delay > 4000) {
                reject('Connection Timeout! :(');
            } else {
                resolve(`Here is your fake data from ${url}`);
            }
        }, delay)
    })
}


// makeRequest(() => {
//     // The success callback function
// }, () => {
//     // The failure callback function
// })



// nested callback request using the fake function without promises
// fakeRequestCallback('books.com/page1', function (response) {
//     console.log('IT WORKED!');
//     console.log(response);
//     fakeRequestCallback('books.com/page2', function (response) {
//         console.log('IT WORKED AGAIN!');
//         console.log(response);
//         fakeRequestCallback('books.com/page3', function (response) {
//             console.log('IT WORKED AGAIN AND AGAIN');
//         }, function (err) {
//             console.log('ERROR! (3rd request)', err);
//         })
//     }, function (err) {
//         console.log('ERROR! (2nd request)', err);
//     })
// }, function (err) {
//     console.log('ERROR!', err);
// })



// Creating a promise object (represents the eventual completion or failure of an asynchronous operation and its resulting value)
// A Promise is in one of these states:
// pending: initial state, neither fulfilled nor rejected.
// fulfilled: meaning that the operation was completed successfully.
// rejected: meaning that the operation failed.

// The methods promise.then(), promise.catch(), and promise.finally() 
// are used to associate further action with a promise that becomes settled.
// The .then() method takes up to two optional arguments; the first argument is a callback function for 
// the resolved case of the promise, and the second argument is a callback function for the rejected case. 
// Each .then() returns a newly generated promise object, which can optionally be used for chaining
// A .catch() is really just a .then() without a slot for a callback function for the case when the promise is resolved.

// const request = fakeRequestPromise('yelp.com/api/coffee');
// request.then(() => {
//     console.log('PROMISE RESOLVED!!');
//     console.log('IT WORKED!');
// }).catch(() => {
//     console.log('PROMISE REJECTED!!');
//     console.log('OH NO, ERROR!!');
// })



// Following, an example to demonstrate the asynchronicity of the then method.

// using a resolved promise, the 'then' block will be triggered instantly,
// but its handlers will be triggered asynchronously as demonstrated by the console.logs
// const resolvedProm = Promise.resolve(33);

// let thenProm = resolvedProm.then(value => {
//     console.log("this gets called after the end of the main stack. the value received and returned is: " + value);
//     return value;
// });
// // instantly logging the value of thenProm
// console.log(thenProm);

// // using setTimeout we can postpone the execution of a function to the moment the stack is empty
// setTimeout(() => {
//     console.log(thenProm);
// });

// logs, in order:
// Promise {[[PromiseStatus]]: "pending", [[PromiseValue]]: undefined}
// "this gets called after the end of the main stack. the value received and returned is: 33"
// Promise {[[PromiseStatus]]: "resolved", [[PromiseValue]]: 33}


// Chaining .then()
// const request = fakeRequestPromise('yelp.com/api/coffee/page1');
// request.then(() => {
//     console.log('IT WORKED! (Page1)');
//     fakeRequestPromise('yelp.com/api/coffee/page2')
//         .then(() => {
//             console.log('IT WORKED! (Page2)');
//             fakeRequestPromise('yelp.com/api/coffee/page3')
//                 .then(() => {
//                     console.log('IT WORKED! (Page3)');
//                 })
//                 .catch(() => {
//                     console.log('OH NO, ERROR!! (Page3)');
//                 })
//         })
//         .catch(() => {
//             console.log('OH NO, ERROR!! (Page2)');
//         })
// }).catch(() => {
//     console.log('OH NO, ERROR!! (Page1)');
// })


// Chaining .then() without nesting 
fakeRequestPromise('yelp.com/api/coffee/page1')
    .then((data) => {
        console.log('IT WORKED!! (Page1)');
        console.log(data);
        return fakeRequestPromise('yelp.com/api/coffee/page2')
    })
    .then((data) => {
        console.log('IT WORKED!! (Page2)');
        console.log(data);
        return fakeRequestPromise('yelp.com/api/coffee/page3')
    })
    .then((data) => {
        console.log('IT WORKED!! (Page3)');
        console.log(data);
    })
    .catch((err) => {
        console.log('OH NO, A REQUEST FAILED!!!');
        console.log(err);
    })



// Processing continues to the next link of the chain even when a .then() lacks a callback function that returns a Promise object.
// Therefore, a chain can safely omit every rejection callback function until the final .catch().
// const myPromise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve('foo');
//     }, 300);
//   });

//   myPromise
//     .then(handleResolvedA, handleRejectedA)
//     .then(handleResolvedB, handleRejectedB)
//     .then(handleResolvedC, handleRejectedC);



