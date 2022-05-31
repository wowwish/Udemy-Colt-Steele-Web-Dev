// We use the 'dotenv' package to read environment variables set up in the root of the directory in a '.env' file
// 'process.env.NODE_ENV' is an environment variable that has one of two values: 'development' or 'production'
// When running app in development mode, it will have the 'development' value and read all the variables set up
// in the '.env' file. Environment variables are handled differently in production.

if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

// console.log(process.env.SECRET); // Print the variable 'SECRET' read from the '.env' file

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const { joiValidationSchema, joiReviewSchema } = require('./validationSchemas');
const Campground = require('./models/campground');
const Review = require('./models/review');
const User = require('./models/user');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport'); // Passport uses the 'PBKDF2' algorithm to convert password to hash
const localStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize'); // This module searches for any keys in objects that begin 
// with a '$' sign or contain a '.', from 'req.body', 'req.query' or 'req.params'. It can then either:
// -  completely remove these keys and associated data from the object, or
// -  replace the prohibited characters with another allowed character.
// The behaviour is governed by the passed option, 'replaceWith'. Set this option to have the sanitizer replace the 
// prohibited characters with the character passed in.
// The config option 'allowDots' can be used to allow dots in the user-supplied data. In this case, only instances of 
// '$' will be sanitized.
// Object keys starting with a '$' or containing a '.' are reserved for use by MongoDB as operators. Without this 
// sanitization, malicious users could send an object containing a '$' operator, or including a '.', which could change 
// the context of a database operation. Most notorious is the '$where' operator, which can execute arbitrary JavaScript 
// on the database.
// The best way to prevent this is to sanitize the received data, and remove any offending keys, or replace the 
// characters with a 'safe' one.
const helmet = require("helmet"); // Another package that comes with a dozen security middleware that we include
// in our app. These middleware add additional headers to each response which makes our app more secure.
// const dbUrl = 'mongodb://localhost:27017/yelp-camp';
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';


// Loading the Routes defined
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

mongoose.connect(dbUrl)
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
// To remove '$' and '.' characters from user-supplied input
app.use(mongoSanitize());
// Or, to replace these prohibited characters with '_', use:
// app.use(
//   mongoSanitize({
//     replaceWith: '_',
//   }));
// app.use(helmet({ contentSecurityPolicy: false })); // Get all the middleware from the helmet package. One of its 
// middleware - 'helmet.contentSecurityPolicy()' will break mapBox, bootstrap and will nullify all images that we 
// show in our app. We can allow/restrict sources of images, scripts, css, media, fonts and other resources which will 
// be used in our  app. This is Content Security policy that restricts the sources of contents used in our app.

// allowed JS script sources
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://cdn.jsdelivr.net/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudfare.com/"
];

// allowed CSS style sources 
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net/",
  "https://cdnjs.cloudfare.com/"
];

// allowed connection sources
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://*.tiles.mapbox.com/",
  "https://events.mapbox.com/",
  "https://api.unsplash.com/"
];

// allowed font style sources
const fontSrcUrls = [];


app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: [],
    connectSrc: ["'self'", ...connectSrcUrls],
    scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
    styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
    workerSrc: ["'self'", "blob:"],
    objectSrc: [],
    imgSrc: [
      "'self'",
      "blob:",
      "data:",
      "https://res.cloudinary.com/dyfjqb3jc/",
      "https://images.unsplash.com/",
      "https://api.unsplash.com/"
    ],
    fontSrc: ["'self'", ...fontSrcUrls],
    mediaSrc: ["https://res.cloudinary.com/dyfjqb3jc/", "https://api.unsplash.com/"],
    childStc: ["blob:"]
  }
}));

// for encryption of session data
const secret = process.env.SECRET || 'thisshouldbeabettersecret';

// configure MongoDB session store to use instead of Memory Store for session data
const store = new MongoStore({
  mongoUrl: dbUrl,
  crypto: {
    secret // same as 'secret: secret'
  },
  touchAfter: 24 * 3690  // If you are using express-session >= 1.10.0 and don't want to resave all the session 
  // on database every single time that the user refresh the page, you can lazy update the session, by limiting a 
  // period of time. by doing this, setting 'touchAfter: 24 * 3600' you are saying to the session be updated only 
  // one time in a period of 24 hours, does not matter how many request's are made (with the exception of those 
  // that change something on the session data)
})

store.on('error', function (e) {
  console.log('SESSION STORE ERROR: ', e)
})

const sessionConfig = {
  name: 'session', // The name of the session-id cookie (Default is 'connect-sid'). We change the session-id cookie name here
  // just as aprecaution to prevent malicious users from accessing cookies by searching with the default name.
  store, // same as setting 'store: store'. Since 'store' is a new MongoDB Session store that we created, a new 
  // collection called 'sessions' will be created in the MongoDB database that is used.
  secret: 'thisshouldbeabettersecret',
  resave: false,
  saveUninitialized: true,
  // Set the expiration time of the session ID cookie 'connect.sid'
  cookie: {
    httpOnly: true, // A security measure to not reveal the cookie to client-side JS scripts using the 
    // 'document.cookie' property of DOM
    // secure: true, // this property when true, allows cookies to be used/configured only over https (secure http connections)
    // This will be commented out during development phase because 'localhost' is not a secure http connection and hence
    // this option will break things in our app like login and logout.
    // However, during web app deployment, we require this option to be set to true.
    expires: Date.now() + (1000 * 60 * 60 * 24 * 7), // expires: should have value milliseconds. 
    // Date.now() also sends value in milliseconds. We want this cookies to expire after a week.
    maxAge: (1000 * 60 * 60 * 24 * 7) // Again, this property's value must be in milliseconds
  }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize()); // Initialize 'Passport', the autthentication middleware
app.use(passport.session()); // passport.session() acts as a middleware to alter the req object and change the 'user' 
// value that is currently the session id (from the client cookie) into the true deserialized user object.
// This allows for persistent login sessions instead of having to login in every single request
// make sure that appluse(session(...)) is used before the app.use(passport.session()) call


/* 

Passport is a module that provides and automates user authentication for Express. It is mostly used to support 
authentication sessions over HTTP.

Configuration:

In app.js add the following require statement:
	
const passport = require('passport');

To configure passport correctly, you need to provide three things:

    An Authentication Strategy
    Application Middleware
    Sessions

Authentication strategies are a way for passport to delegate authentication to other modular packages. For example, 
there are Node packages that provide passport authentication strategies for Facebook and Twitter, etc.

For our local use case, the strategy is provided by the passport-local package. Passport provides the use() function 
for plugging in the strategy (we’ll be doing that differently later), and it generally looks like this when using 
mongoose:
	
const passport = require('passport'), 
  LocalStrategy = require('passport-local').Strategy;
  
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

You’ll notice that the callback function provided to the LocalStrategy object is the one that contains the logic used 
to verify a user’s identity.

The verify callback must return a model of the user when the authentication is successful (the credentials are valid).

In our case it is a mongoose model of the User that will be returned. How this model is constructed will be covered 
once we discuss the passport-local-mongoose package.

Once a strategy has been supplied, the relevant middleware has to be configured with Express so our web server can use 
passport. In an app.js file, it generally looks like the following:
	
const session = require("express-session");
  
app.use(session({ secret: "cats" }));
app.use(express.urlencoded({ extended: true })); // express body-parser
app.use(passport.initialize());
app.use(passport.session());

The order of these statements are important, so keep that in mind.
Using Sessions with Passport

For supporting sessions, passport has to be added as a middleware to the login route or endpoint that you are using 
to authenticate your users, usually with the redirect route values for your application:
	
// Use the passport middleware for authentication
app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}));

When a POST request with the user’s login information is made to the '/login' route, passport uses the local 
authentication strategy to verify that the user’s credentials are valid.

It then serializes the provided User model into one value that is stored in the session object provided by 
express-session.

When future requests from the same user are made with the session cookie, passport uses the serialized session value 
to deserialize or retrieve the User model.

This User object is made available through the request.user property.

In this way, passport builds upon the functionality provided by the express-session package.
passport-local-mongoose

passport-local-mongoose takes care of salting and hashing user passwords, serializing and deserializing your user 
model (for session storage), and authenticating the username and password credentials with their stored counterparts 
in the mongo database.

It is a mongoose plugin first and foremost. It uses the passport-local module internally to provide and configure a 
LocalStrategy of local authentication for the passport module.

Before using this package make sure that you are using mongoose and are connected to a mongod instance in your app.

In app.js add the following require statement:
	
const passportLocalMongoose = require('passport-local-mongoose');

In our model class user.js:
	
const mongoose = require('mongoose'),
passportLocalMongoose = require('passport-local-mongoose');
const UserSchema =  new mongoose.Schema({});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);

The line UserSchema.plugin(passportLocalMongoose) is responsible for extending the model object.

According to the package documentation:

    You’re free to define your User how you like. Passport-Local Mongoose will add a username, hash and salt field to 
    store the username, the hashed password and the salt value.

    Additionally Passport-Local Mongoose adds some methods to your Schema. See the API Documentation section for more details. 

In app.js you add some configuration code for passport:
	
// requires the model with Passport-Local Mongoose plugged in
const User = require('./models/user');
  
// USE "createStrategy" INSTEAD OF "authenticate"
// This uses and configures passport-local behind the scenes
passport.use(User.createStrategy());
  
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport-local-mongoose serializes and deserializes model objects based on the username field, so it should be unique 
to every model.

If mongoose is connected to mongod, this should be all the configuration code needed to use the 
passport-local-mongoose plugin.

To create a User, we can use the register method added by this plugin:
	
app.post('/register', (request, response) => {
    // Creates and saves a new user with a salt and hashed password
    User.register(new User({username: request.body.username}), request.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return response.render('register');
        } else {
            passport.authenticate('local')(request, response, function() {
                response.redirect('/dashboard');
            });
        }
    });
});

Now, when a User is created and stored in the database, this is how it will be stored, as displayed in the mongo shell:
	
> show collections
users
> db.users.find()
{ 
  "_id" : ObjectId("5aea739b999c1e703ca7f093"), 
  "username" : "user", 
  "salt" : "2b3721324daf1f22a0f93cd70ce9bf55c2edad2ee5abaed5eb7e56485bc331af", 
  "hash" : "8fa16f7c0fa2446bac5cb2236dd9d0f4cbd0e555e823b4c45476b1a0e77b5f04e388a7b8e2191fab68dc48edc71c58fa698e626d600e52fb0961722279ee1ec2f3be15b7952a6698484c750a96c91377620542a8588b2c768a1e183cb549a452d68a3130541eed1b6bc03f226d1212441d50f49274d568315166087a3940535db0c3868763c95834edb211d985ca3aa38326cbe02ddfc7a48e043068d9f53e1d969c4b215830e95f306f4f6df8b2de0b51ddac499ddc39ede61744161a1e6b281de067ad5732d6fbc85946b7e7919955656a72e301121e3af4cd12630f3cfb0dc2a2ddf35c1d3417c269ac0b045e8f78f7b607e1cdaeaa61b722dedb6bb1ba86f0a3c16632c64f3a67bd118d4efe5bca7368f02d26e352c93ad28a054a6d792b56e33a436a8adf2f57305bf70f8d52019ff466e6f7f02d7672b69900a4ca98ce5c81290bbdd855a4b4cb533e1056d22c695a5b01ce7add3a3b39696b7bc7194e6792082da3cee3aed9070a1882a72e61229d5a1f4b0df1d64358b7bd849a4d682db4ebc5bf9dd4ae047741b8b2f2446c200bbd6f6954ef0b18d93816aa1ea8ed2bb4d95aa517f2bc09eec10ba7e15ea216dfd111759da9bd5fb567cf9df4253cc5b120e55d53278580318b0435d16a98b56c09f9907b00d79d9f1352377db7be4f494ee49235fc35cfc02e4f031b68665078f9fe415d8e9727b180f593d8663d", 
  "__v" : 0 }

Your User object is now available through request.user in an express app route callback after the user has been 
authenticated by passport.

passport-local-mongoose does not store the password, hash, and salt fields in the request.user object, however, out 
of safety concerns.
Making Your Own Middleware

After a user has been authenticated with passport in a session, you can use the isAuthenticated() method in the 
request object to determine if the user is logged in or not.

You can use this to make your own middleware for verifying if the user is logged in before accessing a certain route:
	
function isLoggedIn(request, response, next) {
    // passport adds this to the request object
    if (request.isAuthenticated()) {
        return next();
    }
    response.redirect('/login');
}

And here it is in action:

	
app.get('/dashboard', isLoggedIn, (request, response) => {
    // dashboard logic
});


Logging Out:

Passport includes a logout() function on request that can be called from a route handler. It removes the request.user 
property and clears the login session.
	
app.get('/logout', (request, response) => {
  request.logout();
  response.redirect('/');
});


*/


/* 

Passport essentially acts as a middleware and alters the value of the 'user' property in the req object to contain 
the deserialized identity of the user. To allow this to work correctly you must include serializeUser and 
deserializeUser functions in your custom code.

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (user, done) {
    //If using Mongoose with MongoDB; if other you will need JS specific to that schema.
    User.findById(user.id, function (err, user) {
        done(err, user);
    });
});

This will find the correct user from the database and pass it as a closure variable into the callback done(err,user); 
so the above code in the passport.session() can replace the 'user' value in the req object and pass on to the next 
middleware in the pile.

*/


passport.use(new localStrategy(User.authenticate())); // ask passport to use the localStrategy that we have required
// use static authenticate method of model in LocalStrategy. We can have multiple authentication Strategies set up
// simultanrously

/* 

Static methods

Static methods are exposed on the model constructor. For example to use createStrategy function use

const User = require('./models/user');
User.createStrategy();

  - authenticate() Generates a function that is used in Passport's LocalStrategy
  - serializeUser() Generates a function that is used by Passport to serialize users into the session
  - deserializeUser() Generates a function that is used by Passport to deserialize users into the session
  - register(user, password, cb) Convenience method to register a new user instance with a given password. 
    Checks if username is unique. See login example.
  - findByUsername() Convenience method to find a user instance by it's unique username.
  - createStrategy() Creates a configured passport-local LocalStrategy instance that can be used in passport.


*/


passport.serializeUser(User.serializeUser()); // How do we store a user in the session
passport.deserializeUser(User.deserializeUser()); // How do we get a user out of the session

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
})


// MIDDLEWARE TO HANDLE FLASH MESSAGES - RUNS ON EVERY REQUEST
app.use((req, res, next) => {
  // console.log(req.query);
  // console.log(req.session);
  // console.log(req.path, req.originalUrl); // We want to redirect the user to the url from where they were
  // redirected to '/login'. This adds statefulness to our app. We can store the previous URL that the user
  // was trying to access without logging in under 'req.session'
  // When a user tries to add a new campground without logging in for example, 'req.path' will contain '/new',
  // the relative path to 'localhost:3000/campgrounds' as set in 'app.use('/campgrounds', campgroundRoutes)'
  // whereas 'req.originalUrl' will contain '/campgrounds/new', the relative path to 'localhost:3000'
  if (!['/login', '/login?', '/favicon.ico', '/'].includes(req.originalUrl)) { // save the path to previous page from where the user goes to the 
    // login page, unless the previous page was also the login page, or the homepage
    req.session.returnTo = req.originalUrl; // This redirection Url will become an issue when using passport version 0.6.0
    // need to find a new way to achieve this functionality in passport 0.6.0
    // Refer: https://github.com/jaredhanson/passport/issues/904
  }
  res.locals.currentUser = req.user; // user name and email will be accessible as an object under this property of
  // each request and can be accessed in templates if a user is currently logged in while the request is sent. Note that
  // the 'res.locals' will be replaced with each request-response cycle.
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

// app.get('/fakeUser', async (req, res) => {
//   const user = new User({ email: 'dio@gmail.com', username: 'konoDioDa' });
//   const newUser = await User.register(user, 'zawarudo');
//   res.send(newUser);
// })


// IMPORTING ROUTE HANDLERS AND SETTING THEIR ROUTE PREFIX
app.use('/campgrounds', campgroundRoutes); // All route-handlers declared in './routes/campgrounds.js' will be used and they will
// all have a starting directory of 'campgrounds/'.
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes); // no root prefix for these routes



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