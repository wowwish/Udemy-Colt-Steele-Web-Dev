// Create an XML HTTP request object and define the function to be run 
// when data is loaded after successful request
const req = new XMLHttpRequest();
req.onload = function () {
    console.log('ALL DONE WITH REQUEST!!');
    // print the request object to the console
    // The 'response' and 'responseText' properties of this object will 
    // contain the JSON string from the request. 
    // Also check that the status propery of the request object is 200.
    console.log(this);
    // console.log(this.responseText);
    const data = JSON.parse(this.responseText);
    console.log('Parsed JSON: ', data);
    // extract values that you want from the parsed object
    console.log(data.name);

}

// Define the behaviour if the request errors out
req.onerror = function () {
    console.log('ERROR!!');
    console.log(this);
}

// Setup the request method and url 
req.open('GET', 'https://swapi.dev/api/people/1');
// send the request
req.send();



// const myReq = new XMLHttpRequest();

// myReq.onload = function () {
//     const data = JSON.parse(this.responseText);
//     console.log(data);
// };

// myReq.onerror = function () {
//     console.log('ERROR!', err);
// };

// myReq.open('get', 'https://icanhazdadjoke.com/', true); // true used to specify asynchronous request
// myReq.setRequestHeader('Accept', 'application/json');
// myReq.send();



// XML HTTP REQUESTS (XHR) REQUIRE NESTING TO PERFORM CHAIN REQUESTS - HAVING A SECOND REQUEST WHEN THE FIRST ONE IS SUCCESSFUL