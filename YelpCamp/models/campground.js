const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema; // Creating a reference called Schema to the Mongoose.Schema function


// Create a seperate schema for image files so we can dynamically transform them using cloudnary for thumbnails
const ImageSchema = Schema({
    url: String,
    filename: String
});

/* 

In Mongoose, a virtual is a property that is not stored in MongoDB. Virtuals are typically used for computed properties 
on documents.

Suppose you have a User model. Every user has an email, but you also want the email's domain. For example, the domain 
portion of 'test@gmail.com' is 'gmail.com'.

Below is one way to implement the domain property using a virtual. You define virtuals on a schema using the 
Schema#virtual() function.

const userSchema = mongoose.Schema({
  email: String
});
// Create a virtual property `domain` that's computed from `email`.
userSchema.virtual('domain').get(function() {
  return this.email.slice(this.email.indexOf('@') + 1);
});
const User = mongoose.model('User', userSchema);

let doc = await User.create({ email: 'test@gmail.com' });
// `domain` is now a property on User documents.
doc.domain; // 'gmail.com'

The Schema#virtual() function returns a VirtualType object. Unlike normal document properties, virtuals do not have 
any underlying value and Mongoose does not do any type coercion on virtuals. However, virtuals do have getters and 
setters, which make them ideal for computed properties, like the domain example above.

Virtual Setters:
You can also use virtuals to set multiple properties at once as an alternative to custom setters on normal properties. 
For example, suppose you have two string properties: firstName and lastName. You can create a virtual property 
fullName that lets you set both of these properties at once. The key detail is that, in virtual getters and setters, 
this refers to the document the virtual is attached to.

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String
});
// Create a virtual property `fullName` with a getter and setter.
userSchema.virtual('fullName').
  get(function() { return `${this.firstName} ${this.lastName}`; }).
  set(function(v) {
    // `v` is the value being set, so use the value to set
    // `firstName` and `lastName`.
    const firstName = v.substring(0, v.indexOf(' '));
    const lastName = v.substring(v.indexOf(' ') + 1);
    this.set({ firstName, lastName });
  });
const User = mongoose.model('User', userSchema);

const doc = new User();
// Vanilla JavaScript assignment triggers the setter
doc.fullName = 'Jean-Luc Picard';

doc.fullName; // 'Jean-Luc Picard'
doc.firstName; // 'Jean-Luc'
doc.lastName; // 'Picard'


*/

// Creating a virtual 'thumbnail' property for ImageSchema. Remember that virtuals are not stored in mongoDB, it is 
// computed everytime a document is queried
ImageSchema.virtual('thumbnail').get(function () {
    if (this.filename !== 'unsplash-template') {
        // We want to set the image width to 200 while maintaining its aspect ratio using the w_200 transformation
        return this.url.replace('/upload', '/upload/w_200'); // use regex to add cloudinary transformation properties to URL
    }
});

const opts = { toJSON: { virtuals: true } }; // option to allow mongoose include virtuals when converting documents 
// to JSON. This 'opts' object is included in mongoose.Schema(), after the actual schema object.

const CampgroundSchema = Schema({
    title: String,
    images: [ImageSchema], // nesting an array of ImageSchemas in CampgroundSchema
    geometry: {
        type: {
            type: String,
            enum: ['Point'], // 'geometry.type' has to be 'Point'
            required: true
        },
        coordinates: {
            type: [Number], // Array of coordinates
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

// Adding virtuals to CampgroundSchema for Popup message information in Cluser Map of index page
CampgroundSchema.virtual('properties.popupMarkup').get(function () { // initializing the popupMarkup virtual and nesting
    // it into the properties key. {properties: {popupMarkup: value}}.
    // BY DEFAULT MONGOOSE DOES NOT INCLUDE VIRTUALS WHEN YOU CONVERT A DOCUMENT TO JSON USING JSON.stringify() or 
    // USING res.json()
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`;
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