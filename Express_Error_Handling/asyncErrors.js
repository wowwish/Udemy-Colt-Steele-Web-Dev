const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const AppError = require('./appError'); // importing custom error class


const Product = require('./models/product');
const { runInNewContext } = require('vm');

mongoose.connect('mongodb://localhost:27017/farmStand2')
    .then(() => {
        console.log('MONGO CONNECTION OPEN!!');
    })
    .catch(err => {
        console.log('OH NO, MONGO CONNECTION ERROR!!');
        console.log(err);
    })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const categories = ['fruit', 'vegetable', 'dairy'];

app.get('/products', async (req, res, next) => {
    try { // Try-catch block to handle all thrown errors
        const { category } = req.query;
        if (category) {
            const products = await Product.find({ category });
            res.render('products/index', { products, category });
        } else {
            const products = await Product.find({});
            res.render('products/index', { products, category: 'All' });
        }
    } catch (e) {
        next(e);
    }
})

app.get('/products/new', (req, res) => {
    // throw new AppError('NOT ALLOWED!', 401);
    res.render('products/new', { categories });
})

// We can use try-catch blocks to handle ValidationErrors. Again, remember to add next in the function parameters.
// We again pass the error to the next() call here.
// Note that next should also be a parameter for the async function in which you perform error-handling because async
// function error-handling requires the next() call on the error object. You can also use an if .. else statement to
// stop the execution of code below the next() call instead of returning the next() call.
app.post('/products', async (req, res, next) => {
    try { // Try-catch block to handle all thrown errors
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.redirect(`/products/${newProduct._id}`);
    } catch (e) {
        next(e);
    }
})

// IMPORTANT:
// Error-Handling using a wrapper Function that wraps the async callbacks in our route-handlers. This wrapper function
// catches any errors thrown by the function inside and provides it to the next() call. This is a better alternative
// to using try-catch blocks in every route handler async function. 
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e));
        // Keep in mind that custom error-handler take precedence over the default error-handler in the next() calls
        // for errors.
    }
}

app.get('/products/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        // throw new AppError('Product not Found', 404); // Throwing an error directly like this in an async 
        // function will crash the app when the browser sends a request to this route. Instead, for an async function
        // the error should be passed to a next() call so that the custom middleware defined below will be invoked
        // return next(new AppError('Product Not Found', 404));
        throw new AppError('Product Not Found', 404);
    }
    // console.log(product);
    res.render('products/show', { product }); // Without returning the next() call above, this code will still run 
    // and the error will be thrown to the console. With return next(), the execution is stopped at the next() call.
}
));


app.get('/products/:id/edit', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        throw new AppError('Product Not Found', 404);
    } else {
        res.render('products/edit', { product, categories });
    }
}));

// We use a put request because we have the potential to updatie all the properties of the product document 
// in a single edit page. This is similar to a document replacement than document modification
app.put('/products/:id', async (req, res, next) => {
    try { // Try-catch block to handle all thrown errors
        const { id } = req.params;
        // Validate and Update
        const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
        res.redirect(`/products/${product._id}`);
    } catch (e) {
        next(e);
    }
})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

// CHAIN OF ERROR HANDLERS ALWAYS COME BELOW THE ROUTE HANDLERS

// We can create custom error-handlers for specific error types.
const handleValidationErr = err => {
    console.log(err);
    return new AppError(`Validation Failed.....${err.message}`, 400);
}
app.use((err, req, res, next) => {
    console.log(err.name);
    if (err.name === 'ValidationError') {
        err = handleValidationErr(err);
    }
    next(err);
})

// defining custom error-handling middleware - once defined, this takes precedence over the default error handler
// This error-handling middleware treats all errors the same way. Keep in mind that Mongoose can throw differeny types
// of errors like ValidationError, CastError etc.
app.use((err, req, res, next) => {
    const { status = 500, message = 'Something Went Wrong!!' } = err; // destructuring the error object
    res.status(status).send(message);
})

app.listen(3000, () => {
    console.log('APP IS LISTENING ON PORT 3000!!');
})