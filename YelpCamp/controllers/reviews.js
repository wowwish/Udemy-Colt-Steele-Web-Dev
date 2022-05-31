const Campground = require('../models/campground');
const Review = require('../models/review');


module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id; // Set the user id to the author filed for pupulating from the users collection
    campground.reviews.push(review);
    await review.save();
    await campground.save(); // Saving the modified campground with a new review linked to it
    req.flash('success', 'Created new Review!');
    res.redirect(`/campgrounds/${campground._id}`);
}


module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    // The $pull operator from MongoDB cam be used to remove all array elements that match a specified query
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/${id}`);
}