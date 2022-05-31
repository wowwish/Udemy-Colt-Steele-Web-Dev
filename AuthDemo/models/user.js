const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be Blank'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password cannot be Blank']
    }
});


// DEFINING CALLABLE METHODS FOR THE USER MODEL/CLASS (NOT ACCESSIBLE TO ITS INSTANCES/DOCUMENTS) THROUGH THE SCHEMA 
// USING STATICS
userSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username }); // Here, 'this' refers to the 'User' model
    const isValid = await bcrypt.compare(password, foundUser.password); // a boolean value is stored in 'isValid'
    return isValid ? foundUser : false;
}

// Declare a pre-hook middleware to salt and hash the password before saving it
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        // "this.isModified('key')" returns a true if the value of the key has been modified and false if not
        return next(); // This return statement skips the following code below in this pre-hook middleware
        // However, next() will be run and the middleware chain will continue
    }
    // here, 'this' refers to the particular instance (document) of the User model
    this.password = await bcrypt.hash(this.password, 12); // hashing the raw password after 12 rounds of salting
    next(); // The next() call actually calls the document.save() method
})

module.exports = mongoose.model('User', userSchema);