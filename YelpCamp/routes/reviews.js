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
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');


// destructuring the schema from the imported object
const { joiReviewSchema } = require('../validationSchemas');





router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports = router;
