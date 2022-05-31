const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema; // saving the mongoose.Schema method into a variable

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true // Mongoose will build a unique index on this path when the model is compiled. 
        // The unique option is not a validator.
    }
});

userSchema.plugin(passportLocalMongoose); // Passport-Local-Mongoose will add the username, salt and password fields to 
// userSchema, makes sure that the username value is unique, and also adds additional methods for use in the model that
// will use this schema (static methods)


module.exports = mongoose.model('User', userSchema);
