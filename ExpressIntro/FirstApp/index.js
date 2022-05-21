// Use 'npm init -y' to create a default package.json and skip all the interactive questions
// Use 'npm i express' to install express.
// RUN: node index.js
// Use ctrl + C to stop the server. Stop and Restart the server by running the above command everytime you make changes in this script


const express = require('express'); // CommonJs module

const app = express(); // We execute expression using the express() function
// console.dir(app); // The app object has many methods on it: route, listen, param, enable, disable, copy, get, post etc


// anytime we have an incoming request, this callback will be run irrespective of a GET or POST request.
// app.use(() => {
//     console.log("WE GOT A NEW REQUEST!");
// });


// The app.use callback function has access to the request and response objects created by express for each incoming request
// Express converts the incoming request into a JS object
// app.use((req, res) => {
//     console.dir(req); // returns a massive object. Check out the header property.
    // The res object represents the HTTP response that an Express app sends when it gets an HTTP request
    // https://expressjs.com/en/5x/api.html#res
    // res.send("HELLO, WE GOT YOUR REQUEST !! THIS IS A RESPONSE");
    // Express automatically sets the header of the response ('content-type' is set to 'text/html' if a string is returned or 
    // to 'application/json' when a JS object is returned as response)
    // res.send({color: 'red'}) // Response with JSON
    // Response with HTML
    // res.send('<h1>THIS IS MY WEBPAGE!</h1>'); // HTML response will be rendered in the Browser and the request is done when the reponse is returned
// })
// You can also send requests to specific paths like 'localhost:3000/dogs'. This pathname information can also bee seen in the 'req' object
// Once you setup the request to be sent, like above, you will get the response in the browser irrespective of the pathname provided along with the port
// Both 'http://localhost:3000' and 'http://localhost:3000/dogs' provide the same response. We can use ROUTING to modify the response
// based on the path requested.



// ROUTING 


// Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) 
// and a specific HTTP request method (GET, POST, and so on).
// Each route can have one or more handler functions, which are executed when the route is matched.
// Route definition takes the following structure:
// app.METHOD(PATH, HANDLER)
// Where:
//     app is an instance of express.
//     METHOD is an HTTP request method, in lowercase.
//     PATH is a path on the server.
//     HANDLER is the function executed when the route is matched.
// 


// NOTE: app.get() ONLY RESPONDS TO GET REQUESTS!!!
// There is a special routing method, app.all(), used to load middleware functions at a path for all HTTP request methods. 
// For example, the following handler is executed for requests to the route “/secret” whether using GET, POST, PUT, DELETE, or any other:

// app.all('/secret', (req, res, next) => {
//     console.log('Accessing the secret section ...')
//     next() // pass control to the next handler
//   })



// Adding a route '/cats' that sends the string 'MEOW!!' as response
app.get('/cats', (req, res) => {
    // console.log('CAT REQUEST!');
    res.send('MEOW!!');
})

// Adding a route '/dogs' that sends the string 'WOOF!!' as response
app.get('/dogs', (req, res) => {
    // console.log('CAT REQUEST!');
    res.send('WOOF!!');
})

// Adding a route to the root '/' that sends the string 'THIS IS THE HOME PAGE!!' as response
app.get('/', (req, res) => {
    // console.log('CAT REQUEST!');
    res.send('WELCOME TO THE HOME PAGE!!!');
})

// Adding a POST method to the '/cats' path
app.post('/cats', (req, res) => {
   res.send('POST REQUEST TO /cats ... THIS IS DIFFERENT FROM A GET REQUEST!!'); 
});


// We can also define patterns for routes
// Route paths can be strings, string patterns, or regular expressions.
// The characters ?, +, *, and () are subsets of their regular expression counterparts. 
// The hyphen (-) and the dot (.) are interpreted literally by string-based paths.
// If you need to use the dollar character ($) in a path string, enclose it escaped within ([ and ]). 
// For example, the path string for requests at “/data/$book”, would be “/data/([\$])book”.

// Route parameters are named URL segments that are used to capture the values specified at their position in the URL. 
// The captured values are populated in the req.params object, with the name of the route parameter specified in the path as 
// their respective keys.

// Route path: /users/:userId/books/:bookId
// Request URL: http://localhost:3000/users/34/books/8989
// req.params: { "userId": "34", "bookId": "8989" }

// This pathname will match any path that starts with '/r/' and the ':subreddit' is a route parameter
app.get('/r/:subreddit', (req, res) => { // slash has special meaning in paths. Hence 'http://localhost:3000/r/cats/dogs' wont match
    // 'http://localhost:3000/r/cats/dogs' will not be recognized by this pattern because of slash in 'cats/dogs'
    // console.log(req.params); // will print { subreddit: <matched part of path> } to the console
    const { subreddit } = req.params;
    // res.send("THIS IS A SUBREDDIT!");
    res.send(`<h1>Browsing the ${subreddit} subreddit`); // prints the matching subreddit name as a header in the browser when request is made
})


// We can also have multiple request parameters
app.get('/r/:subreddit/:postId', (req, res) => {
    console.log(req.params);
    const {subreddit, postId} = req.params;
    res.send(`<h1>Viewing Post ID: ${postId} on the ${subreddit} Subreddit</h1>`);
})


app.get('/search', (req, res) => {
    // This property is an object containing a property for each query string parameter in the route. When query parser is set to disabled, 
    // it is an empty object {}, otherwise it is the result of the configured query parser.
    // The req.query property contains all query strings that are supplied after the '?' in the request.
    // For example, a request to 'http://localhost:3000/search?q=dogs&color=red' will create the following req.query object:
    // { q: 'dogs', color: 'red' }
    // '&' is used to seperate multiple 'key=value' pairs in the query string
    // console.log(req.query);
    const { q } = req.query; 
    if (!q) {
        res.send('NOTHING FOUND IF NOTHING SEARCHED');
    }
    res.send(`<h1>Search Results for: ${q}</h1>`);
})


// A GET request handler of all requests that donot match the defined paths with a generic response
// THIS METHOD DEFINITION SHOULD ALWAYS COME AFTER THE DEFINITIONS FOR DEFINED ROUTES. OTHERWISE, IT WILL BREAK THE FUNCTIONALITY 
// OF THE ROUTES BELOW IT !!!
// This is because this handler matches all routes and when it comes first, it will win against other handlers below it and all incoming
// GET requests will match with this handler!! Since this handler is defined for GET requests, putting this on top wont affect POST requests.
app.get('*', (req, res) => {
    res.send('I DO NOT KNOW THAT PATH!!');
})

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000');
}); // Here, 3000 is the port, the second argument is a callback function that runs when the app starts
// Once you run 'node index.js', the app starts, prints the LISTENING ON PORT 3000 message and it waits for requests to come in. 
// Your console will be occupied by the running app. You can go to 'localhost:3000' to access the running app. The 'localhost' in the 
// URL means your current machine in which the app was initiated. You will get a 'Cannot GET /' error from the app when 
// the app.use callback is not defined.

// When app.use() callback is defined, everytime you send any request (or reload the Browser page / press ENTER in the address bar), the 
// app.use() callback function will be run and any message it prints will appear in the console.

// If you want many different apps / servers running simultaneously, they have to listen to different Ports. The main use of ports is
// To manage the traffic to the machine by splitting them across different entrances / endpoints.

// Without a response from the Server, the browser will just keep waiting for a response.

// RUN: node index.js

// TO AUTOMATICALLY RESTART THE SERVER WHENEVER YOU CHANGE THE EXPRESS CODE, ONE OPTION IS TO USE THE 'nodemon' PACKAGE
// USING NODEMON FOR SERVER AUTO RESTART ON CODE UPDATES:
// RUN: "npm install -g nodemon" to install, use "nodemon -l index.js'" to run the server script
// YOU CAN USE 'rs' TO RESTART THE SERVER MANUALLY THROUGH NODEMON IF THE AUTO-RESTART DOES NOT WORK