const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');

// destructuring the schema from the imported object
const { joiValidationSchema } = require('../validationSchemas');

// DEFINING DATA VALIDATION MIDDLEWARE AT THE FORM SUBMISSION LEVEL USING JOI
const validateCampground = (req, res, next) => {
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


router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

// using wrapper function for error handling
router.post('/', validateCampground, catchAsync(async (req, res, next) => { // adding 'next' argument for error-handling middleware
    // Chaining middleware calls - First the data validation Middleware runs, and then the error Handler
    // validateCampground() is a synchronous function, os it handles the next() call on errors automatically. But, we 
    // need to call next() if no errors are thrown inside the validateCampground() middleware function to call the next
    // middleware function
    // res.send(req.body);
    // try { // try-catch block to send error to custom erro-handling middleware
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400); // throw custom error if the request 
    // body does not contain a campground property which is itself an object matching the CampgroundSchema 
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
    // } catch (e) {
    //   next(e);
    // }
}))

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Campground not Found!');
        return res.redirect('/campgrounds'); // We use return to stop the route-handler with this redirection
        // and prevent the following code from running.
    }
    res.render('campgrounds/show', { campground });
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Campground not Found!');
        return res.redirect('/campgrounds'); // We use return to stop the route-handler with this redirection
        // and prevent the following code from running.
    }
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    // Chaining middleware calls - First the data validation Middleware runs, and then the error Handler
    // validateCampground() is a synchronous function, os it handles the next() call on errors automatically. But, we 
    // need to call next() if no errors are thrown inside the validateCampground() middleware function to call the next
    // middleware function
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    // Using spread operator '...' to spread the new object into the old object
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);

}))

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Campground!');
    res.redirect('/campgrounds');
})


module.exports = router;