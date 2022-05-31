const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');
// destructuring the schema from the imported object
const { joiValidationSchema, joiReviewSchema } = require('./validationSchemas');

module.exports.isLoggedIn = (req, res, next) => {
    // console.log("REQ.USER...", req.user); // Passport adds this property to each request after deserializing
    // information from the session store. This will be 'undefined' when the user is not logged in.
    // Note that the object under this property only contains username and email. The password/hash is not saved here.
    if (!req.isAuthenticated()) { // The isAuthenticated() method is automatically added to each request when the 
        // passport module is loaded using require()
        // console.log(req.path, req.originalUrl); // We want to redirect the user to the url from where they were
        // redirected to '/login'. This adds statefulness to our app. We can store the previous URL that the user
        // was trying to access without logging in under 'req.session'
        // When a user tries to add a new campground without logging in for example, 'req.path' will contain '/new',
        // the relative path to 'localhost:3000/campgrounds' as set in 'app.use('/campgrounds', campgroundRoutes)'
        // whereas 'req.originalUrl' will contain '/campgrounds/new', the relative path to 'localhost:3000'
        // req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be Signed In to perform that action!');
        return res.redirect('/login');
    }
    next();
}


// DEFINING DATA VALIDATION MIDDLEWARE AT THE FORM SUBMISSION LEVEL USING JOI
module.exports.validateCampground = (req, res, next) => {
    // const result = joiValidationSchema.validate(req.body); // returns an object with req body params and validation errors
    // console.log(result);
    const { error } = joiValidationSchema.validate(req.body); // destructuring and obtaining the error property fron Joi validation object
    if (error) { // if the error key is having a defined error as value in the validation result object from Joi
        // Remember that 'error.details' is an orray of objects. ( details: [ [Object] ] )
        // console.log(error.details); 
        /* EXAMPLE 'error.details' OBJECT
          {
          message: '"campground.price" must be greater than or equal to 0',
          path: [ 'campground', 'price' ],
          type: 'number.min',
          context: { limit: 0, value: -2, label: 'campground.price', key: 'price' }
        }
      ] */
        const msg = error.details.map(el => el.message).join(','); // loop through every object in 'error.details' array
        // and join the messages with ','
        throw new ExpressError(msg, 400);
    } else {
        next(); // Move on to the next middleware function / error-handler.
    }
}

// MIDDLEWARE TO CHECK USER AUTHORIZATION TO MODIFY/DELETE CAMPGROUNDS
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // Allow the user to edit the campground only if they are its author.
    // Passport adds the 'req.user' property to each request after deserializing
    // information from the session store. This will be 'undefined' when the user is not logged in. 
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


// MIDDLEWARE TO CHECK USER AUTHORIZATION TO DELETE REVIEWS IN A CAMPGROUND SHOW PAGE
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params; // destructuring both campground ID and review ID from req.params
    const review = await Review.findById(reviewId);
    // Allow the user to edit the campground only if they are its author.
    // Passport adds the 'req.user' property to each request after deserializing
    // information from the session store. This will be 'undefined' when the user is not logged in. 
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}



// VALIDATION MIDDLEWARE
module.exports.validateReview = (req, res, next) => {
    const { error } = joiReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next(); // Move on to the next middleware function / error-handler.
    }
}