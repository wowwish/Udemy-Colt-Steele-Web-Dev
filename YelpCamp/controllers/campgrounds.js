const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary'); // NodeJS will automatically search for 'index.js' in the given directory
const mbxGeodocing = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
// creating and configuring the client to send requests to MapBox
const geocoder = mbxGeodocing({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => { // adding 'next' argument for error-handling middleware
    // Chaining middleware calls - First the data validation Middleware runs, and then the error Handler
    // validateCampground() is a synchronous function, os it handles the next() call on errors automatically. But, we 
    // need to call next() if no errors are thrown inside the validateCampground() middleware function to call the next
    // middleware function
    // res.send(req.body);
    // try { // try-catch block to send error to custom erro-handling middleware
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400); // throw custom error if the request 
    // body does not contain a campground property which is itself an object matching the CampgroundSchema 

    // Using the forward geocoding service to get the latitude and longitude coordinates for the campground location
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    // console.log(geoData);
    // console.log(geoData.body.features);
    // console.log(geoData.body.features[0].geometry); // returns [longitude, latitude]. 
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    // Taking the path and filename from each image uploaded to cloudinary from the create new campground form,
    // (from the array of cloudinary image objects) and
    // mapping them to an array and saving the array to 'campground.images'.
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id; // 'request.user' is automatically added in by passport. Now any user created campground,
    // will have thier name in it 
    await campground.save();
    // console.log(campground);
    req.flash('success', 'Successfully made a new Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
    // } catch (e) {
    //   next(e);
    // }
}

module.exports.showCampground = async (req, res) => {
    // We need to get the Campground document and then do a nested populate. First we populate the Review field of the
    // campground document. Then we use nesting to populate the author field of the review of the campground.
    // Next, we populate the author field of the campground itself. 
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    /* 
    
    Populating across multiple levels

    Say you have a user schema which keeps track of the user's friends.

    const userSchema = new Schema({
        name: String,
    friends: [{ type: ObjectId, ref: 'User' }]
    });

    Populate lets you get a list of a user's friends, but what if you also wanted a user's friends of friends? 
    Specify the populate option to tell mongoose to populate the friends array of all the user's friends:

    User.
        findOne({ name: 'Val' }).
        populate({
            path: 'friends',
            // Get friends of friends - populate the 'friends' array for every friend
            populate: { path: 'friends' }
        });

    
    */

    // console.log(campground);
    if (!campground) {
        req.flash('error', 'Campground not Found!');
        return res.redirect('/campgrounds'); // We use return to stop the route-handler with this redirection
        // and prevent the following code from running.
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground not Found!');
        return res.redirect('/campgrounds'); // We use return to stop the route-handler with this redirection
        // and prevent the following code from running.
    }
    res.render('campgrounds/edit', { campground });
}


module.exports.updateCampground = async (req, res) => {
    // Chaining middleware calls - First the data validation Middleware runs, and then the error Handler
    // validateCampground() is a synchronous function, os it handles the next() call on errors automatically. But, we 
    // need to call next() if no errors are thrown inside the validateCampground() middleware function to call the next
    // middleware function
    const { id } = req.params;
    // console.log(req.body);
    // add the additional images uploaded by user for this particular campground
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    // Take every element of the 'imgs' array and push it one-by-one into the 
    // 'campground.images' array
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground, $push: { images: { $each: imgs } } });
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            if (filename !== 'unsplash-template') {
                // delete file from cloudinary when it is present in req.body.deleteImages
                await cloudinary.uploader.destroy(filename);
            }
        }
        // pull/delete all images from the campground.images array where the image filename is in req.body.deleteImages
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        console.log(campground);
    }
    await campground.save();
    // Using spread operator '...' to spread the new object into the old object
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);

}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Campground!');
    res.redirect('/campgrounds');
}