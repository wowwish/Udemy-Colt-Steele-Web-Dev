const baseJoi = require('joi'); // schema description language and data validator for JS.
const sanitizeHTML = require('sanitize-html');

// Creating a custom extension function for JOI Validation Schemas to use to make sure cross-site-scripting
// or javascript injection through HTML <script> tags does not take place.
const extension = (joi) => ({
    type: 'string', // this extension applies to 'string' type values
    base: joi.string(), // The base to which the extension is added
    messages: {
        'string.escapeHTML': "{{#label}} must not include HTML or special characters like '&'!"
    },
    rules: {
        escapeHTML: { // The extension is called 'escapeHTML' and it can be added to the validation chain like so: 
            // 'Joi.string().required().escapeHTML()'
            validate(value, helpers) { // This validate function is mandatory and Joi will call it on whatever value 
                // it recieves when this extension is used anywhere.
                // // Allow only a super restricted set of tags and attributes using the 'sanitizeHTML()' function from 
                // 'sanitize-html' package
                // // Allow only a super restricted set of tags and attributes in the string 'value'
                const clean = sanitizeHTML(value, {
                    allowedTags: [], // No HTML tags are allowed in the string - very Strict
                    allowedAttributes: {}, // No HTML tag attributes are allowed - very Strict
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = baseJoi.extend(extension); // Adding the custom extension for HTML sanitization that we created to base Joi

// DECLATING A JOI VALIDATION SCHEMA - NOT A MONGOOSE MODEL SCHEMA
module.exports.joiValidationSchema = Joi.object({ // Generates a schema object that matches an object data type. Defaults to allowing any child key.
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(), // calling our custom extension on this value
        price: Joi.number().min(0).required(),
        // image: Joi.string().required(), // No image validation used here, can add file size based validation
        location: Joi.string().required().escapeHTML(), // calling our custom extension on this value
        description: Joi.string().required().escapeHTML() // calling our custom extension on this value
    }).required(), // required() marks a key as required and will not allow undefined as value. 
    // All keys are optional by default.
    deleteImages: Joi.array()
});


module.exports.joiReviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML() // calling our custom extension on this value
    }).required() // required() marks a key as required and will not allow undefined as value. 
    // All keys are optional by default.
});