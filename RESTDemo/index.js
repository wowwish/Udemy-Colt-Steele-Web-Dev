// https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm  - REST dissertation
// REST is an architectural style for distributed hypermedia systems. It is a set of guidelines for how a 
// client + server model should communicate and perform CRUD operations on a given resource.
// Refer https://restfulapi.net/ for the 6 Guidelines to be followed by a REST API
// Also Refer https://en.wikipedia.org/wiki/Representational_state_transfer#Uniform_interface


const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid'); // destructuring function v4 from 'uuid' package as 'uuidv4'


// A property can be unpacked from an object and assigned to a variable with a different name than the object property.

// const o = {p: 42, q: true};
// const {p: foo, q: bar} = o;

// console.log(foo); // 42
// console.log(bar); // true

// Here, for example, const {p: foo} = o takes from the object o the property named p and assigns it to a local variable named foo.


// Setting view engine to ejs
app.set('view engine', 'ejs');
// Set the 'views' directory where the ejs templates are stored, use the path module from nodejs 
app.set('views', path.join(__dirname, 'views'));

// Here, we are using 'express.urlencoded', the in-built request body parser middleware function from express
// to parse request body from POST requests


// express.urlencoded([options])

// This is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is 
// based on body-parser. It returns middleware that only parses urlencoded bodies and only looks at requests where 
// the Content-Type header matches the type option. This parser accepts only UTF-8 encoding of the body and supports 
// automatic inflation of gzip and deflate encodings. A new body object containing the parsed data is populated on the 
// request object after the middleware (i.e. req.body), or an empty object ({}) if there was no body to parse, the 
// Content-Type was not matched, or an error occurred. This object will contain key-value pairs, where the value can be 
// a string or array (when extended is false), or any type (when extended is true). As req.body’s shape is based on 
// user-controlled input, all properties and values in this object are untrusted and should be validated before trusting. For example, req.body.foo.toString() may fail in multiple ways, for example foo may not be there or may not be a string, and toString may not be a function and instead a string or other user-input.

// The following table describes the properties of the optional options object:

// extended - This option allows to choose between parsing the URL - encoded data with the querystring
// library(when false) or the qs library(when true).The “extended” syntax allows for rich objects and arrays to be 
// encoded into the URL - encoded format, allowing for a JSON - like experience with URL - encoded.For more information,
//     please see the qs library. [Type: Boolean, Default: false]

// inflate - Enables or disables handling deflated(compressed) bodies; when disabled, deflated bodies are rejected. 
// [Type: Boolean, Default: true]

// limit - Controls the maximum request body size.If this is a number, then the value specifies the number of bytes;
// if it is a string, the value is passed to the bytes library for parsing. [Type: Mixed, Default: "100kb"]

// parameterLimit - This option controls the maximum number of parameters that are allowed in the URL - encoded data.
// If a request contains more parameters than this value, an error will be raised. [Type: Number, Default: 1000]

// type - This is used to determine what media type the middleware will parse.This option can be a string, array of
// strings, or a function. If not a function, type option is passed directly to the type - is library and this can be 
// an extension name(like urlencoded), a mime type(like application / x - www - form - urlencoded), or a mime type with 
// a wildcard(like * /x-www-form-urlencoded). If a function, the type option is called as fn(req) and the request is 
// parsed if it returns a truthy value. [Type: Mixed, Default: "application/x - www - form - urlencoded"]

// verify - This option, if supplied, is called as verify(req, res, buf, encoding), where buf is a Buffer of the 
// raw request body and encoding is the encoding of the request.The parsing can be aborted by throwing an error. 
// [Type: Function, Default: undefined]


app.use(express.urlencoded({ extended: true }));

// To parse req.body with parameters in JSON format. Try sending raw JSON in the request body through POSTMAN 
// with a POST request to 'localhost:3000/tacos' 

// express.json([options])

// This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on 
// body-parser. Returns middleware that only parses JSON and only looks at requests where the Content-Type header 
// matches the type option. This parser accepts any Unicode encoding of the body and supports automatic inflation of 
// gzip and deflate encodings. A new body object containing the parsed data is populated on the request object after 
// the middleware (i.e. req.body), or an empty object ({}) if there was no body to parse, the Content-Type was not 
// matched, or an error occurred. As req.body’s shape is based on user-controlled input, all properties and values in
// this object are untrusted and should be validated before trusting. For example, req.body.foo.toString() may fail in 
// multiple ways, for example foo may not be there or may not be a string, and toString may not be a function and 
// instead a string or other user-input.

// The following table describes the properties of the optional options object:


// inflate - Enables or disables handling deflated(compressed) bodies; when disabled, deflated bodies are
// rejected. [Type: Boolean, Default: true]

// limit - Controls the maximum request body size.If this is a number, then the value specifies the number of bytes;
// if it is a string, the value is passed to the bytes library for parsing. [Type: Mixed, Default: "100kb"]

// reviver - The reviver option is passed directly to JSON.parse as the second argument.You can find more information 
// on this argument in the MDN documentation about JSON.parse. [Type: Function, Default: null]

// strict - Enables or disables only accepting arrays and objects; when disabled will accept anything JSON.parse
// accepts. [Type: Boolean, Default: true]

// type - This is used to determine what media type the middleware will parse.This option can be a string, array of
// strings, or a function. If not a function, type option is passed directly to the type - is library and this can be an 
// extension name(like json), a mime type(like application / json), or a mime type with a wildcard(like */* or */json).
// If a function, the type option is called as fn(req) and the request is parsed if it returns a truthy value.
// [Type: Mixed, Default: "application/json"]

// verify - This option, if supplied, is called as verify(req, res, buf, encoding), where buf is a Buffer of the raw 
// request body and encoding is the encoding of the request.The parsing can be aborted by throwing an error.
// [Type: Function, Default: undefined]

app.use(express.json());

// Set an additional parameter in the query string called '_method' that performs HTTP request Method Override on POST requests
// override with POST having ?_method=PATCH in our case
app.use(methodOverride('_method'));

// Declaring Data array as let to allow changes to the array itself
// REMEMBER, WHEN THE APP RESTARTS, ONLY THESE FOUR COMMENTS WILL BE SHOWN IN THE INDEX ROUTE
let comments = [
    {
        // create unique id for each comment
        id: uuidv4(),
        username: 'Todd',
        comment: 'lol that is so funny!'
    },
    {
        id: uuidv4(),
        username: 'Skyler',
        comment: 'I like to go birdwatching with my dog'
    },
    {
        id: uuidv4(),
        username: 'Sk8erBoi',
        comment: 'Plz delete your account, Todd'
    },
    {
        id: uuidv4(),
        username: 'onlysayswoof',
        comment: 'woof woof woof'
    }
];


// IMPLEMENTING REST PRINCIPLES

// GET /comments - list all comments - Index route
// POST /comments - Create a new comment - Create route
// GET /comments/:id - Get one comment (using ID) - Show route
// PATCH /comments/:id - Update one comment - Update route
// DELETE /comments/:id - Destroy one comment - Delete route


app.get('/comments', (req, res) => {
    res.render('comments/index', { comments }); // render the comments/index.ejs file from the views template dir
    // also passing the comments array to the template
})

// Create a new route to allow creation of comments
app.get('/comments/new', (req, res) => {
    res.render('comments/new');
});

// If you refresh the page showing 'IT WORKED!', you will get an alert from the browser to confirm Form Resubmission.
// If you contiue with the resubmission, the same comment will be added as many times as you refreshed, to the array
// leading to duplication of comments because the same form submit action will be executed multiple times. So we want 
// to redirect the user to '/comments'
app.post('/comments', (req, res) => {
    // console.log(req.body);
    const { username, comment } = req.body;
    comments.push({ username, comment, id: uuidv4() });
    // res.send('IT WORKED!');
    // res.redirect() redirects to the URL derived from the specified path, with specified status, 
    // a positive integer that corresponds to an HTTP status code . If not specified, status defaults to “302 “Found”.
    // Examples:
    //     res.redirect('/foo/bar')
    //     res.redirect('http://example.com')
    //     res.redirect(301, 'http://example.com')
    //     res.redirect('../login')

    // Redirects can be a fully-qualified URL for redirecting to a different site:

    //     res.redirect('http://google.com')

    // Redirects can be relative to the root of the host name. For example, if the application is 
    // on http://example.com/admin/post/new, the following would redirect to the URL http://example.com/admin:

    //     res.redirect('/admin')

    // Redirects can be relative to the current URL. For example, 
    // from http://example.com/blog/admin/ (notice the trailing slash), the following would redirect to 
    // the URL http://example.com/blog/admin/post/new.

    //     res.redirect('post/new')

    // Redirecting to post/new from http://example.com/blog/admin (no trailing slash), will redirect 
    // to http://example.com/blog/post/new.

    // If you found the above behavior confusing, think of path segments as directories (with trailing slashes) and 
    // files, it will start to make sense.

    // Path-relative redirects are also possible. If you were on http://example.com/admin/post/new, 
    // the following would redirect to http://example.com/admin/post:

    //     res.redirect('..')

    // A back redirection redirects the request back to the referer, defaulting to / when the referer is missing.

    //     res.redirect('back')

    res.redirect('/comments'); // Defaults to GET request and redirects from '/comments/new' to '/comments'
    // The response will have a redirect status code '302'
});


app.get('/comments/:id', (req, res) => {
    const { id } = req.params;
    // The find() method returns the first element in the provided array that satisfies the provided testing function. 
    // If no values satisfy the testing function, undefined is returned. Here we are testing for equality of the passed
    // id with id of each comment in the array
    // const comment = comments.find(c => c.id === parseInt(id));
    const comment = comments.find(c => c.id === id); // uuidv4() returns a string id that can be directly compared
    res.render('comments/show', { comment });
})


// HTTP defines a set of request methods to indicate the desired action to be performed for a given resource. 
// Although they can also be nouns, these request methods are sometimes referred to as HTTP verbs. Each of them 
// implements a different semantic, but some common features are shared by a group of them: e.g. a request method can 
// be safe, idempotent, or cacheable.

// GET

//     The GET method requests a representation of the specified resource. Requests using GET should only retrieve data.
// HEAD

//     The HEAD method asks for a response identical to a GET request, but without the response body.
// POST

//     The POST method submits an entity to the specified resource, often causing a change in state or side effects on the server.
// PUT

//     The PUT method replaces all current representations of the target resource with the request payload.
// DELETE

//     The DELETE method deletes the specified resource.
// CONNECT

//     The CONNECT method establishes a tunnel to the server identified by the target resource.
// OPTIONS

//     The OPTIONS method describes the communication options for the target resource.
// TRACE

//     The TRACE method performs a message loop-back test along the path to the target resource.
// PATCH

//     The PATCH method applies partial modifications to a resource.


//     Routing methods:

//     Express supports the following routing methods corresponding to the HTTP methods of the same names:

//     checkout
//     copy
//     delete
//     get
//     head
//     lock
//     merge
//     mkactivity
//     mkcol
//     move
//     m-search
//     notify
//     options
//     patch                
//     post
//     purge
//     put
//     report
//     search
//     subscribe
//     trace
//     unlock
//     unsubscribe

// The API documentation has explicit entries only for the most popular HTTP methods app.get(), app.post(), app.put(), 
// and app.delete(). However, the other methods listed above work in exactly the same way. To route methods that 
// translate to invalid JavaScript variable names, use the bracket notation. 
// For example, app['m-search']('/', function ....


// Creating a form to Update comments
app.get('/comments/:id/edit', (req, res) => {
    const { id } = req.params;
    const comment = comments.find(c => c.id === id);
    res.render('comments/edit', { comment });
})


//  testing PATCH requests through POSTMAN - send PATH request to 'http://localhost:3000/comments/<id>' with 
// the request body containing {"comment": <newComment>}
// PUT REQUEST REPLACES THE COMPLETE TARGET RESOURCE, IN THIS CASE, AN ENTIRE COMMENT OBJECT IN THE comments ARRy
// PATCH REQUEST PARTIALLY REPLACES THE TARGET RESOURCE, IN THIS CASE, ONLY THE comment PROPERTY IS CHANGED OF AN ELEMENT OF THE comments ARRAY
app.patch('/comments/:id', (req, res) => {
    // res.send('UPDATING SOMETHING!');
    const { id } = req.params;
    // extract the new comment from request body
    const newCommentText = req.body.comment;
    // extract the old comment object from the comments array
    const foundComment = comments.find(c => c.id === id);
    // replace the old comment with new comment
    foundComment.comment = newCommentText;
    res.redirect('/comments');
})


// DELETE comments
app.delete('/comments/:id', (req, res) => {
    const { id } = req.params;
    // A GOOD PRACTICE IS TO CREATE A COPY OF THE NEW ARRAY AND SET IT AS THE ORIGINAL ARRAY INSTEAD OF DIRECTLY DELETING
    comments = comments.filter(c => c.id !== id);
    res.redirect('/comments');
})


// A GET request submits the request parameters through the query string. These parameters are accessible via the
// 'request.query' object
app.get('/tacos', (req, res) => {
    res.send('GET /tacos response');
});

// A POST request submits the request parameters in the request body


// 'req.body' contains key-value pairs of data submitted in the request body. By default, it is undefined, 
// and is populated when you use body-parsing middleware such as body-parser and multer.

// As req.body’s shape is based on user-controlled input, all properties and values in this object are untrusted 
// and should be validated before trusting. For example, req.body.foo.toString() may fail in multiple ways, 
// for example foo may not be there or may not be a string, and toString may not be a function and 
// instead a string or other user-input.

// The following example shows how to use body-parsing middleware to populate req.body.

// const app = require('express')()
// const bodyParser = require('body-parser')
// const multer = require('multer') // v1.0.5
// const upload = multer() // for parsing multipart/form-data

// app.use(bodyParser.json()) // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// app.post('/profile', upload.array(), (req, res, next) => {
//   console.log(req.body)
//   res.json(req.body)
// })


// Here, we are using 'express.urlencoded', the in-built request body parser from express


app.post('/tacos', (req, res) => {
    // http://expressjs.com/en/5x/api.html#req.body
    console.log(req.body);
    const { meat, qty } = req.body;
    res.send(`OK. Here are your ${qty} ${meat} taco(s)!`);
})

app.listen('3000', () => {
    console.log('ON PORT 3000!');
})

