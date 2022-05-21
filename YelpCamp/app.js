const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
// destructuring the schema from the imported object
const { joiValidationSchema, joiReviewSchema } = require('./validationSchemas');
const Campground = require('./models/campground');
const Review = require('./models/review');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { resourceLimits } = require('worker_threads');

// Loading the Routes defined
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
  .then(() => {
    console.log('CONNECTION OPEN!!!');
  })
  .catch(err => {
    console.log('OH NO ERROR!!!');
    console.log(err);
  });

app.engine('ejs', ejsMate); // Registers the given template engine callback for the given file extension
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // query string to override request method
app.use(express.static(path.join(__dirname, 'public'))); // Serving CSS and JS as static assets by putting them in a single directory
// Remember that 'public' is the root directory and only files residing inside this directory (including sub-directories)
// can be used with relative pathing as static file assests.
const sessionConfig = {
  secret: 'thisshouldbeabettersecret',
  resave: false,
  saveUninitialized: true,
  // Set the expiration time of the session ID cookie 'connect.sid'
  cookie: {
    httpOnly: true, // A security measure to not reveal the cookie to client-side scripts using the 'document.cookie' property of DOM
    expires: Date.now() + (1000 * 60 * 60 * 24 * 7), // expires: should have value milliseconds. 
    // Date.now() also sends value in milliseconds. We want this cookies to expire after a week.
    maxAge: (1000 * 60 * 60 * 24 * 7) // Again, this property's value must be in milliseconds
  }
}
app.use(session(sessionConfig));
app.use(flash());

app.listen(3000, () => {
  console.log('Serving on port 3000');
})


// Middleware to handle flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash('success'); // Extracting the 'success' value from flash on creating/updating/deleting 
  // a Campground or review, and storing it into the response to be rendered in the template
  res.locals.error = req.flash('error'); // Extracting the 'error' value from flash on creating/updating/deleting
  // a Campground or review, and storing it into the response to be rendered in the template
  next();
})


//  ROUTE- HANDLERS

app.get('/', (req, res) => {
  res.render('home')
})

app.use('/campgrounds', campgrounds); // All route-handlers declared in './routes/campgrounds.js' will be used and they will
// all have a starting directory of 'campgrounds/'.
app.use('/campgrounds/:id/reviews', reviews);



// REQUEST HANDLER FOR ANY TYPE OF REQUEST TO INVALID URLS - this will only run when other route-handlers defined above
// have not matched 
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
})

// ORDER MATTERS IN DEFINING ROUTES. HERE, IF REQUEST TO '/campgrounds/:id' WAS DEFINED BEFORE '/campgrounds/new',
// THE 'new' PATH WILL BE TREATED AS A VALUE TO 'id' in req.params

// DEFINING CUSTOM ERROR HANDLING MIDDLEWARE

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err; // destructuring the custom ExpressError
  if (!err.message) err.message = 'Oh no, Something went Wrong!';
  // and default error properties
  res.status(statusCode).render('error', { err }); // render the view template 'error.ejs' and send the error status code
  // res.send('Oh Boy, something went wrong!');
})