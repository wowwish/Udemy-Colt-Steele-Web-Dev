const Joi = require('joi'); // schema description language and data validator for JS.


// DECLATING A JOI VALIDATION SCHEMA - NOT A MONGOOSE MODEL SCHEMA
module.exports.joiValidationSchema = Joi.object({ // Generates a schema object that matches an object data type. Defaults to allowing any child key.
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().min(0).required(),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required() // required() marks a key as required and will not allow undefined as value. 
    // All keys are optional by default.
});


module.exports.joiReviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required() // required() marks a key as required and will not allow undefined as value. 
    // All keys are optional by default.
});