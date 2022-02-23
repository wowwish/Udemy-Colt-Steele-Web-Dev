// https://github.com/axios/axios
// A JS Library for Fetching Requests


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



// With axios, the promise is resolved only once the data stream is fully captured and parsed into JSON
// console.log(axios.get('https://swapi.dev/api/people/1'))



// axios.get('https://swapi.dev/api/people/1')
//     .then(res => {
//         console.log(res.data.name);
//     })
//     .catch(err => {
//         console.log('ERROR!', err);
//     })


// async function implementation

const getHeroName = async function () {
    try {
        const res = await axios.get('https://swapi.dev/api/people/1');
        console.log(res.data.name);
    }
    catch (e) {
        console.log('ERROR!', err);
    }
}


// getHeroName();

const jokes = document.querySelector('#jokes')
const button = document.querySelector('button');



const addNewJoke = async () => {
    const jokeText = await getDadJoke();
    const newLi = document.createElement('li');
    newLi.innerText = jokeText;
    jokes.append(newLi);
}

const getDadJoke = async () => {
    // Each API will have its own requirement for return JSON formatable data. Read the API docs to figure it out. 
    // This particular API needs the header of request to have the 'Accept' property set to 'application/json' for it 
    // to return data in JSON string. We can change additional properties of the header as well.
    try {
        const config = { headers: { Accept: 'application/json' } }
        const res = await axios.get('https://icanhazdadjoke.com', config);
        // console.log(res);
        // console.log(res.data.joke);
        return res.data.joke;
    } catch (e) {
        return 'NO JOKES AVAILABLE! SORRY :(';
    }

}


button.addEventListener('click', addNewJoke);
