// Creates a Promise instead of callbacks
// A better alternative to XML HTTP requests (XHRs)
//  the fetch() command returns a promise object that also includes the header information when it is resolved
// console.log(fetch('https://api.cryptonator.com/api/ticker/btc-usd'));

// fetch triggers the resolving of the promise which triggers .then(), as soon as the header information comes back from the promise
//  It does not wait till any/all the data or the whole body of the request is returned. Data arrives in streams. not all at once, hence 
// it may take time to obtain all the data and EVEN WHEN ONLY THE HEADER IS RECIEVED AS IS THE CASE IN FAILED REQUESTS, THE PROMISE FROM
// FETCH() WILL STILL BE RESOLVED

// fetch() starts a request and returns a promise. When the request completes, the promise is resolved with the Response object. 
// If the request fails due to some network problems, the promise is rejected.


// fetch() doesn't throw an error when the server returns a bad HTTP status, e.g. client (400–499) or server errors (500–599).
// fetch() rejects only if a request cannot be made or a response cannot be retrieved. It might happen because of network problems: 
// no internet connection, host not found, the server is not responding.
// response.ok property lets you separate good from bad HTTP response statuses. The property is set to true only if 
// the response has status 200-299.
// fetch('https://swapi.dev/api/people/1')
//     .then(res => {
//         console.log('RESPONSE, WAITING TO PARSE:  ', res)
//         // The json() method of the Response interface takes a Response stream and reads it to completion. 
//         // It returns a promise which resolves with the result of parsing the body text as JSON. 
//         // This promise is resolved only after the entire data stream is parsed into JSON
//         return res.json() // returns apromise when all of the data from the request has been recieved and parsed into JSON
//     })
//     .then(data => {
//         console.log('DATA PARSED...', data)
//         console.log(data.name)
//     })
//     .catch(err => {
//         console.log('OH NO! ERROR!')
//     })




// Fetch using async

const fetchHeroName = async () => {
    try {
        const res = await fetch('https://swapi.dev/api/people/1')
        console.log(res)
        const data = await res.json()
        console.log(data.name);
    }
    catch (e) {
        console.log('SOMETHING WENT WRONG!!!', e);
    }
}

fetchHeroName();
