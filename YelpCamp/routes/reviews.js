const express = require('express');
// The route params defined in the app.use() call on this router object, will be seperate and have to be merged
// with the params of the actual route handlers defined here.
// eg: app.use('/campgrounds/:id/reviews', reviews); 
// use the option 'mergeParams: true' to preserve the req.params values from the parent router. 
// If the parent and the child have conflicting param names, the child’s value take precedence.
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');


// destructuring the schema from the imported object
const { joiReviewSchema } = require('../validationSchemas');


// VALIDATION MIDDLEWARE
const validateReview = (req, res, next) => {
    const { error } = joiReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next(); // Move on to the next middleware function / error-handler.
    }
}


router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new Review!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    // The $pull operator from MongoDB cam be used to remove all array elements that match a specified query
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/${id}`);
}))


module.exports = router;
