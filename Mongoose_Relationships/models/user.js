const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/relationshipDemo')
    .then(() => {
        console.log('MONGO CONNECTION OPEN!!');
    }).catch(err => {
        console.log('OH NO MONGO CONNECTION ERROR!!');
        console.log(err);
    });


// EXAMPLE OF A ONE-TO-FEW RELATIONSHIP USING EMBEDDED SCHEMA OF MONGOOSE

const userSchema = new mongoose.Schema({
    first: String,
    last: String,
    addresses: [
        {
            _id: { id: false }, // This will prevent Mongoose from inserting IDs and treating this object as an 
            // embedded Schema
            street: String,
            city: String,
            state: String,
            country: String
        }
    ]
})

const User = mongoose.model('User', userSchema); // mongo db collection will be called 'users'


// One-time-use function to get data into the collection
const makeUser = async () => {
    const u = new User({
        first: 'Harry',
        last: 'Potter'
    });
    u.addresses.push({
        street: '123 Sesame St.',
        city: 'New York',
        state: 'New York',
        country: 'USA'
    });
    const res = await u.save();
    console.log(res); // Notice the '_id' property in elements of addresses. 
    // Mongo adds a new id to each document whereas Mongoose treats the addresses property value as an embedded Schema

}

// One-time-use fubnction to add additional address element to an existing user.
const addAddress = async (id) => {
    const user = await User.findById(id);
    user.addresses.push({
        street: '99 Gingely St.',
        city: 'New York',
        state: 'New York',
        country: 'USA'
    });
    const res = await user.save();
    console.log(res);
}

makeUser();
addAddress('6280a07fa886f947aef6e985');