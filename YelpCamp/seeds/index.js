const mongoose = require('mongoose');
const axios = require('axios');
const Campground = require('../models/campground');
const cities = require('./cities');
// destructure both arrays exported from seedHelpers.js
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log('CONNECTION OPEN!!!');
    })
    .catch(err => {
        console.log('OH NO ERROR!!!');
        console.log(err);
    });

// Function to obtain random element from array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// function to obtain random image from unsplash.com
const seedImg = async function () {
    try {
        const res = await axios.get('https://api.unsplash.com/photos/random', {
            headers: { 'Accept-version': 'v1' },
            params: { client_id: 'Cxx_Lyz2Mcd03eKxzOmWkHgYF5HSlJ53dj5mxiba2Io', collections: 1114848 }
        })
        return res.data.urls.small;
    } catch (err) {
        console.log(err);
    }
}

const seedDB = async () => {
    await Campground.deleteMany({}); // delete everything from the Campground Mongoose Model/MongoDB Collection
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: await seedImg(),
            // The urls come from the 'In the Woods' image collection by Jeffrey Hamilton on unsplash.com
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam corrupti maiores explicabo amet molestiae quisquam tenetur. Exercitationem expedita sint recusandae, sit non fugit mollitia ipsa, odio corporis similique perferendis atque.',
            price // using Shorthand syntax
        });
        await camp.save();
    }
}

seedDB();