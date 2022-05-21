/* 

express.Router():

Use the express.Router class to create modular, mountable route handlers. A Router instance is a complete middleware 
and routing system; for this reason, it is often referred to as a “mini-app”.

The following example creates a router as a module, loads a middleware function in it, defines some routes, and 
mounts the router module on a path in the main app.

Create a router file named birds.js in the app directory, with the following content:

const express = require('express')
const router = express.Router()

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/', (req, res) => {
  res.send('Birds home page')
})
// define the about route
router.get('/about', (req, res) => {
  res.send('About birds')
})

module.exports = router

Then, load the router module in the app:

const birds = require('./birds')

// ...

app.use('/birds', birds)

The app will now be able to handle requests to /birds and /birds/about, as well as call the timeLog middleware 
function that is specific to the route.

*/

const express = require('express');
const app = express();
// getting route-handlers from a defined router object
const shelterRoutes = require('./routes/shelters');
const dogRoutes = require('./routes/dogs');
const adminRoutes = require('./routes/admin');

// FAKE AUTHENTICATION MIDDLEWARE - Defining Middleware in the main app file makes it general to all routes.
// The middleware below makes all routes respond with 'SORRY, NOT AN ADMIN'. If we want it to work only on
// routes having the 'localhost:3000/admin' prefix, we can put this middleware in 'routes/admin.js'
// app.use((req, res, next) => {
//     if (req.query.isAdmin) {
//         next();
//     }
//     res.send('SORRY, NOT AN ADMIN!');
// })


// The '/shelters' argument here corresponds to a root path,to which the paths specified in the router object will 
// be added as sub-paths. For example, a route-handler for GET requests to '/:id' becomes a handler for GET request 
// to '/shelters/:id' 
app.use('/shelters', shelterRoutes);
app.use('/dogs', dogRoutes);
app.use('/admin', adminRoutes);


app.listen(3000, () => {
    console.log('Serving app on localhost:3000');
})