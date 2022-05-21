const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name cannot be Blank'] // Setting custom ValidationError message
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: ['fruit', 'vegetable', 'dairy'],
        lowercase: true
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;