const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema; // Creating a reference called Schema to the Mongoose.Schema function

const CampgroundSchema = Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});


// DELETION POST HOOK MIDDLEWARE TO CLEAN UP REVIEWS OF THE DELETED CAMPGROUND
// findByIdAndDelete() method used to delete a campground calls findOneAndDelete() in the background. This is a
// query middleware that returns back a query function. We can set our 'post hook' to this background method call
// Since the 'post hook' will be run only after the async query has completed returning a document. We want to
// search and delete in this returned document.
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    // console.log(doc);
    if (doc) { // If findOneAndDelete() does not find anything to delete it will return 'null'
        await review.deleteMany({
            _id: { $in: doc.reviews }
        });
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);