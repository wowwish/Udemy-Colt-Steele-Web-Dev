// EXPRESS MIDDLEWARE ARE FUNCTION THAT RUN DURING THE REQUEST - RESPONSE LIFECYCLE. EACH MIDDLEWARE HAS ACCESS TO
// THE REQUEST AND RESPONSE OBJECT. MIDDLEWARE CAN END THE HTTP REQUEST BY SENDING A RESPONSE WITH METHODS LIKE res.send().
// MIDDLEWARE CAN ALSO BE CHAINED TOGETHER ONE AFTER ANOTHER BY CALLING next().

/** 

Using middleware:

Express is a routing and middleware web framework that has minimal functionality of its own: An Express application 
is essentially a series of middleware function calls.

Middleware functions are functions that have access to the request object (req), the response object (res), and the 
next middleware function in the application’s request-response cycle. The next middleware function is commonly 
denoted by a variable named next.

Middleware functions can perform the following tasks:

    - Execute any code.
    - Make changes to the request and the response objects.
    - End the request-response cycle.
    - Call the next middleware function in the stack.

If the current middleware function does not end the request-response cycle, it must call next() to pass control to
the next middleware function. Otherwise, the request will be left hanging.

An Express application can use the following types of middleware:

    - Application-level middleware
    - Router-level middleware
    - Error-handling middleware
    - Built-in middleware
    - Third-party middleware

You can load application-level and router-level middleware with an optional mount path. You can also load a series of 
middleware functions together, which creates a sub-stack of the middleware system at a mount point.
Application-level middleware

Bind application-level middleware to an instance of the app object by using the app.use() and app.METHOD() functions, 
where METHOD is the HTTP method of the request that the middleware function handles (such as GET, PUT, or POST) in 
lowercase.

This example shows a middleware function with no mount path. The function is executed every time the app receives a 
request.

const express = require('express')
const app = express()

app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

This example shows a middleware function mounted on the /user/:id path. The function is executed for any type of 
HTTP request on the /user/:id path.

app.use('/user/:id', (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})

This example shows a route and its handler function (middleware system). The function handles GET requests to 
the /user/:id path.

app.get('/user/:id', (req, res, next) => {
  res.send('USER')
})

Here is an example of loading a series of middleware functions at a mount point, with a mount path. It illustrates a 
middleware sub-stack that prints request info for any type of HTTP request to the /user/:id path.

app.use('/user/:id', (req, res, next) => {
  console.log('Request URL:', req.originalUrl)
  next()
}, (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})

Route handlers enable you to define multiple routes for a path. The example below defines two routes for GET requests 
to the /user/:id path. The second route will not cause any problems, but it will never get called because the first 
route ends the request-response cycle.

This example shows a middleware sub-stack that handles GET requests to the /user/:id path.

app.get('/user/:id', (req, res, next) => {
  console.log('ID:', req.params.id)
  next()
}, (req, res, next) => {
  res.send('User Info')
})

// handler for the /user/:id path, which prints the user ID
app.get('/user/:id', (req, res, next) => {
  res.send(req.params.id)
})

To skip the rest of the middleware functions from a router middleware stack, call next('route') to pass control to 
the next route. NOTE: next('route') will work only in middleware functions that were loaded by using the app.METHOD() 
or router.METHOD() functions.

This example shows a middleware sub-stack that handles GET requests to the /user/:id path.

app.get('/user/:id', (req, res, next) => {
  // if the user ID is 0, skip to the next route
  if (req.params.id === '0') next('route')
  // otherwise pass the control to the next middleware function in this stack
  else next()
}, (req, res, next) => {
  // send a regular response
  res.send('regular')
})

// handler for the /user/:id path, which sends a special response
app.get('/user/:id', (req, res, next) => {
  res.send('special')
})

Middleware can also be declared in an array for reusability.

This example shows an array with a middleware sub-stack that handles GET requests to the /user/:id path

function logOriginalUrl (req, res, next) {
  console.log('Request URL:', req.originalUrl)
  next()
}

function logMethod (req, res, next) {
  console.log('Request Type:', req.method)
  next()
}

const logStuff = [logOriginalUrl, logMethod]
app.get('/user/:id', logStuff, (req, res, next) => {
  res.send('User Info')
})

Router-level middleware:

Router-level middleware works in the same way as application-level middleware, except it is bound to an instance of 
express.Router().

const router = express.Router()

Load router-level middleware by using the router.use() and router.METHOD() functions.

The following example code replicates the middleware system that is shown above for application-level middleware, by 
using router-level middleware:

const express = require('express')
const app = express()
const router = express.Router()

// a middleware function with no mount path. This code is executed for every request to the router
router.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

// a middleware sub-stack shows request info for any type of HTTP request to the /user/:id path
router.use('/user/:id', (req, res, next) => {
  console.log('Request URL:', req.originalUrl)
  next()
}, (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})

// a middleware sub-stack that handles GET requests to the /user/:id path
router.get('/user/:id', (req, res, next) => {
  // if the user ID is 0, skip to the next router
  if (req.params.id === '0') next('route')
  // otherwise pass control to the next middleware function in this stack
  else next()
}, (req, res, next) => {
  // render a regular page
  res.render('regular')
})

// handler for the /user/:id path, which renders a special page
router.get('/user/:id', (req, res, next) => {
  console.log(req.params.id)
  res.render('special')
})

// mount the router on the app
app.use('/', router)

To skip the rest of the router’s middleware functions, call next('router') to pass control back out of the router 
instance.

This example shows a middleware sub-stack that handles GET requests to the /user/:id path.

const express = require('express')
const app = express()
const router = express.Router()

// predicate the router with a check and bail out when needed
router.use((req, res, next) => {
  if (!req.headers['x-auth']) return next('router')
  next()
})

router.get('/user/:id', (req, res) => {
  res.send('hello, user!')
})

// use the router and 401 anything falling through
app.use('/admin', router, (req, res) => {
  res.sendStatus(401)
})

Error-handling middleware:

Error-handling middleware always takes four arguments. You must provide four arguments to identify it as an 
error-handling middleware function. Even if you don’t need to use the next object, you must specify it to maintain 
the signature. Otherwise, the next object will be interpreted as regular middleware and will fail to handle errors.

Define error-handling middleware functions in the same way as other middleware functions, except with four arguments 
instead of three, specifically with the signature (err, req, res, next)):

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

For details about error-handling middleware, see: Error handling.
Built-in middleware

Starting with version 4.x, Express no longer depends on Connect. The middleware functions that were previously 
included with Express are now in separate modules; see the list of middleware functions.

Express has the following built-in middleware functions:

    express.static serves static assets such as HTML files, images, and so on.
    express.json parses incoming requests with JSON payloads. NOTE: Available with Express 4.16.0+
    express.urlencoded parses incoming requests with URL-encoded payloads. NOTE: Available with Express 4.16.0+

Third-party middleware:

Use third-party middleware to add functionality to Express apps.

Install the Node.js module for the required functionality, then load it in your app at the application level or at 
the router level.

The following example illustrates installing and loading the cookie-parsing middleware function cookie-parser.

$ npm install cookie-parser

const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')

// load the cookie-parsing middleware
app.use(cookieParser())

0







Writing middleware for use in Express apps:

Overview:

Middleware functions are functions that have access to the request object (req), the response object (res), and 
the next function in the application’s request-response cycle. The next function is a function in the Express router 
which, when invoked, executes the middleware succeeding the current middleware.

Middleware functions can perform the following tasks:

    - Execute any code.
    - Make changes to the request and the response objects.
    - End the request-response cycle.
    - Call the next middleware in the stack.

If the current middleware function does not end the request-response cycle, it must call next() to pass control 
to the next middleware function. Otherwise, the request will be left hanging.

The following figure shows the elements of a middleware function call:

    var express = require('express');
    var app = express();

    app.get('/', function(req, res, next) {
        next();
    })

    app.listen(3000);

Where,

app.get() - HTTP method for which the middleware function applies.
'/' - Path (route) for which the middleware function applies.
function(req, res, next) - The middleware function.
next  - Callback argument to the middleware function, called "next" by convention.
res  - HTTP response argument to the middleware function, called "res" by convention.
req  - HTTP request argument to the middleware function, called "req" by convention.

Starting with Express 5, middleware functions that return a Promise will call next(value) when they reject or 
throw an error. next will be called with either the rejected value or the thrown Error.
Example

Here is an example of a simple “Hello World” Express application. The remainder of this article will define and add 
three middleware functions to the application: one called myLogger that prints a simple log message, one called 
requestTime that displays the timestamp of the HTTP request, and one called validateCookies that validates incoming 
cookies.

const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000)

Middleware function myLogger:

Here is a simple example of a middleware function called “myLogger”. This function just prints “LOGGED” when a 
request to the app passes through it. The middleware function is assigned to a variable named myLogger.

const myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}

Notice the call above to next(). Calling this function invokes the next middleware function in the app. The next() 
function is not a part of the Node.js or Express API, but is the third argument that is passed to the middleware 
function. The next() function could be named anything, but by convention it is always named “next”. To avoid 
confusion, always use this convention.

To load the middleware function, call app.use(), specifying the middleware function. For example, the following 
code loads the myLogger middleware function before the route to the root path (/).

const express = require('express')
const app = express()

const myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}

app.use(myLogger)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000)

Every time the app receives a request, it prints the message “LOGGED” to the terminal.

The order of middleware loading is important: middleware functions that are loaded first are also executed first.

If myLogger is loaded after the route to the root path, the request never reaches it and the app doesn’t print 
“LOGGED”, because the route handler of the root path terminates the request-response cycle.

The middleware function myLogger simply prints a message, then passes on the request to the next middleware 
function in the stack by calling the next() function.
Middleware function requestTime

Next, we’ll create a middleware function called “requestTime” and add a property called requestTime to the request 
object.

const requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
}

The app now uses the requestTime middleware function. Also, the callback function of the root path route uses 
the property that the middleware function adds to req (the request object).

const express = require('express')
const app = express()

const requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
}

app.use(requestTime)

app.get('/', (req, res) => {
  let responseText = 'Hello World!<br>'
  responseText += `<small>Requested at: ${req.requestTime}</small>`
  res.send(responseText)
})

app.listen(3000)

When you make a request to the root of the app, the app now displays the timestamp of your request in the browser.
Middleware function validateCookies

Finally, we’ll create a middleware function that validates incoming cookies and sends a 400 response if cookies 
are invalid.

Here’s an example function that validates cookies with an external async service.

async function cookieValidator (cookies) {
  try {
    await externallyValidateCookie(cookies.testCookie)
  } catch {
    throw new Error('Invalid cookies')
  }
}

Here we use the cookie-parser middleware to parse incoming cookies off the req object and pass them to our 
cookieValidator function. The validateCookies middleware returns a Promise that upon rejection will automatically 
trigger our error handler.

const express = require('express')
const cookieParser = require('cookie-parser')
const cookieValidator = require('./cookieValidator')

const app = express()

async function validateCookies (req, res, next) {
  await cookieValidator(req.cookies)
  next()
}

app.use(cookieParser())

app.use(validateCookies)

// error handler
app.use((err, req, res, next) => {
  res.status(400).send(err.message)
})

app.listen(3000)

Note how next() is called after await cookieValidator(req.cookies). This ensures that if cookieValidator resolves, 
the next middleware in the stack will get called. If you pass anything to the next() function (except the 
    string 'route' or 'router'), Express regards the current request as being an error and will skip any remaining 
    non-error handling routing and middleware functions.

Because you have access to the request object, the response object, the next middleware function in the stack, and 
the whole Node.js API, the possibilities with middleware functions are endless.

For more information about Express middleware, see: Using Express middleware.
Configurable middleware

If you need your middleware to be configurable, export a function which accepts an options object or other 
parameters, which, then returns the middleware implementation based on the input parameters.

File: my-middleware.js

module.exports = function (options) {
  return function (req, res, next) {
    // Implement the middleware function based on the options object
    next()
  }
}

The middleware can now be used as shown below.

const mw = require('./my-middleware.js')

app.use(mw({ option1: '1', option2: '2' }))

Refer to cookie-session and compression for examples of configurable middleware.



 */


const express = require('express');
const morgan = require('morgan');
const app = express();

// A very elementary middleware
// app.use(() => {
//     // no matter what request or which url, this function will be run and 'HEYY' will be printed to the console on 
//     // every request. Try this by reloading the browser page of 'localhost:3000'. Also try a vague request like
//     // 'localhost:3000/hello' and check the node console. But the browser will be stuck in reloading and timeout
//     // no response will be sent. 
//     // This code snippet will be run for every request.
//     console.log('HEYY');
// });

app.use(morgan('dev')); // calls morgan('tiny') on every request. This prints information related to the request like
// the request method, the request url, the status code, the response time etc.
// Morgan middleware function runs only after the response is recieved.

// Chaining middlewrare - ORDER MATTER IN MIDDLEWARE CHAINING WHEN USING next() INSTEAD OF MIDDLEWARE SPECIFIC CALLS
// app.use((req, res, next) => {
//     console.log('THIS IS MY FIRST MIDDLEWARE!');
//     next(); // if this next() is not called, the second middleware below this will not be called and 
//     // no response will be sent.
//     console.log("AFTER CALLING NEXT() IN FIRST MIDDLEWARE!"); // this code will execute after the middleware chain 
//     // is completely executed because next() is called above it.
// });
// app.use((req, res, next) => {
//     console.log('THIS IS MY SECOND MIDDLEWARE!');
//     return next(); // add a return keyword before next() call to make sure that no code below the next() call runs.
//     console.log("AFTER CALLING NEXT() IN SECOND MIDDLEWARE!");
// });
// app.use((req, res, next) => {
//     console.log('THIS IS MY THIRD MIDDLEWARE!');
//     next();
// });
// CUSTOM MIDDLEWARE FUNCTIONS CAN BE USED TO ACCESS, MODIFY OR ADD INFORMATION TO THE REQUEST BEFORE IT IS SENT TO A ROUTE


app.use((req, res, next) => {
    // Emulatin Morgan's behaviour
    // console.log(req.method.toUpperCase(), req.path);
    // next();
    //      req.method = 'GET'; // Change every request's method to GET
    //      next();
    req.requestTime = Date.now(); // Add the current date as a property in the request object
    next();
});

// YOU CAN ALSO DEFINE MIDDLEWARE THAT RUNS ONLY ON REQUESTS TO A SPECIFIC ROUTE/PATH. MIDDLEWARE PATHS ALSO SUPPORT
// WILDCARDS WHICH CAN BE USED TO CALL THE MIDDLEWARE ON ALL MATCHING ROUTES/PATHS
app.use('/dogs', (req, res, next) => {
    console.log('I LOVE DOGS!!');
    next();
});

// Defining a Middleware function to be used in route handlers as additional callback
const verifyPassword = (req, res, next) => {
    const { password } = req.query;
    if (password === 'multiverse') {
        next();
    } else {
        res.send('SORRY, YOU NEED A PASSWORD!!');
    }
};

// KEEP IN MIND THAT ONCE A RESPONSE IS SENT, THE REQUEST RESPONSE CYCLE STOPS. HENCE, NO MIDDLEWARE CAN BE RUN
// AFTER A RESPONSE IS SENT. IF YOU DEFINE A CUSTOM MIDDLEWARE BELOW ALL THE ROUTING HANDLERS, IT WILL NOT BE RUN.
app.get('/', (req, res) => {
    console.log(`REQUEST TIME: ${req.requestTime}`);
    res.send('HOME PAGE');
});

app.get('/dogs', (req, res) => {
    console.log(`REQUEST TIME: ${req.requestTime}`);
    res.send('WOOF WOOF');
});

// Route handlers like app.ger() and app.post() can have multiple callbacks that act just like middleware functions.
// Here, we are protecting a route using query string based password (NOT A RECOMMENDED APPROACH FOR AUTHENTICATION)
// In this case, the next() call within the verifyPassword will call the next callback function within app.get()
app.get('/secret', verifyPassword, (req, res) => {
    res.send('MY SECRET IS: I like turtles :)')
})

// THIS CUSTOM MIDDLEWARE WILL NEVER BE RUN WHEN A PROPER REQUEST IS SENT TO ONE OF THE ROUTE HANDLER DEFINED ABOVE 
// BECAUSE A RESPONSE WILL BE SENT FROM A DEFINED ROUTE.
// IT WILL ONLY RUN WHEN THE REQUEST ROUTE DOES NOT MATCH THE ABOVE DEFINED ROUTES AS NO RESPONSE WOULD HAVE BEEN SENT.
// WE CAN USE SUCH A MIDDLEWARE FUNCTION TO DEFINE THE BEHAVIOUR OF THE APP FOR UNDEFINED ROUTES.
app.use((req, res, next) => {
    res.status(404).send('NOT FOUND');
    next();
});


app.listen(3000, () => {
    console.log('App is running on localhost:3000');
});