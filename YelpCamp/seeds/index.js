const mongoose = require('mongoose');
const axios = require('axios');
const Campground = require('../models/campground');
const cities = require('./cities');
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
// destructure both arrays exported from seedHelpers.js
const { places, descriptors } = require('./seedHelpers');

mongoose.connect(dbUrl)
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
const seedImg = async function (num) {
    try {
        const res = await axios.get('https://api.unsplash.com/photos/random', {
            headers: { 'Accept-version': 'v1' },
            params: { client_id: process.env.UNSPLASH_TOKEN, collections: 1114848 }
        })
        return { url: res.data.urls.small, filename: `unsplash-template${num}` };
    } catch (err) {
        console.log(err);
    }
}

const seedDB = async () => {
    await Campground.deleteMany({}); // delete everything from the Campground Mongoose Model/MongoDB Collection
    for (let i = 0; i < 25; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            // YOUR FIRST USER's ID
            author: '628a5e4dcca8a36f09dc7457', // setting author to an '_id' of one of the Users in the 'users' collection
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: await seedImg(),
            // The urls come from the 'In the Woods' image collection by Jeffrey Hamilton on unsplash.com
            images: [await seedImg("1"), await seedImg("2")],
            // {
            //     url: 'https://res.cloudinary.com/dyfjqb3jc/image/upload/v1653760150/YelpCamp/jhjno893cx274hdlhii6.jpg',
            //     filename: 'YelpCamp/jhjno893cx274hdlhii6'
            // },
            // {
            //     url: 'https://res.cloudinary.com/dyfjqb3jc/image/upload/v1653760151/YelpCamp/u9yjlkwwg4sa22ia1vix.jpg',
            //     filename: 'YelpCamp/u9yjlkwwg4sa22ia1vix'
            // }
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam corrupti maiores explicabo amet molestiae quisquam tenetur. Exercitationem expedita sint recusandae, sit non fugit mollitia ipsa, odio corporis similique perferendis atque.',
            price // using Shorthand syntax
        });
        await camp.save();
    }
}

seedDB();