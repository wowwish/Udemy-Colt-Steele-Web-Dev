const mongoose = require('mongoose');
const Product = require('./product'); // The Product schema is required for the deleteion Middleware post hook 
const { Schema } = mongoose;

const farmSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Farm must have a name!']
    },
    city: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Email required!']
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
});

// Mongoose has 4 types of middleware: document middleware, model middleware, aggregate middleware, and 
// query middleware.In document middleware functions, 'this' refers to the document.
// In query middleware functions, 'this' refers to the query.
// findByIdAndDelete(id) is a shorthand for findOneAndDelete({ _id: id })
// In other Words, triggers findByIdAndDelete(id) the findOneAndDelete() middleware.

// In mongoose 5.x, instead of calling next() manually, you can use a function that returns a promise. In particular, 
// you can use async / await.

// We need to set up a middleware to delete all products associated with a farm when the farm document is deleted.
// We need to write a deletion middleware to handle this deletion process. Remember that both findOneAndDelete() and
// findByIdAndDelete() are query middlewares that return a query, not a document. Hence 'this' in our custom deletion
// middleware will point to a Query object which has to be awaited to get the actual document.  

// farmSchema.pre('findOneAndDelete', async function (data) {
//     console.log('PRE MIDDLEWARE!!');
//     console.log(data);
// });
// farmSchema.post('findOneAndDelete', async function (data) {
//     console.log('POST MIDDLEWARE!!');
//     console.log(data);
// });

// Using post hook middleware because only then, will we have access to the actual document. 
farmSchema.post('findOneAndDelete', async function (farm) {
    // console.log(farm);
    if (farm.products.length) { // Check if atleast one element is there in the products array of the farm
        // Delete every product with the same '_id' as in farm.products
        const res = await Product.deleteMany({ _id: { $in: farm.products } });
        // console.log(res);
    }
    // Remember that next() call is not required to continue the chain of middlewares inside an async function
})

const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm;