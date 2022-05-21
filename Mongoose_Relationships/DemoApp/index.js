const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');

const mongoose = require('mongoose');

// importing Mongoose Model from another file
const Product = require('./models/product');
const Farm = require('./models/farm');

mongoose.connect('mongodb://localhost:27017/farmStandTake2')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    }).catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!");
        console.log(err);
    })


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// To parse request body
app.use(express.urlencoded({ extended: true }));
// To Override form submission methods
app.use(methodOverride('_method'));

const categories = ['fruit', 'vegetable', 'dairy'];


// FARM ROUTES - REMEMBER, ORDER MATTERS IN ROUTE HANDLER DEFINITIONS
app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', { farms });
})

// Create new Farm
app.get('/farms/new', (req, res) => {
    res.render('farms/new');
});

// SHow details of a specific farm
app.get('/farms/:id', async (req, res) => {
    const farm = await Farm.findById(req.params.id).populate('products'); // Populate the 'Products' field of the Farm document
    // console.log(farm);
    res.render('farms/show', { farm });
})

// Delete a Farm
app.delete('/farms/:id', async (req, res) => {
    const farm = await Farm.findByIdAndDelete(req.params.id);
    res.redirect('/farms');
})

// Add a new Farm linked with Product
app.get('/farms/:id/products/new', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    res.render('products/new', { categories, farm });
})

app.post('/farms/:id/products', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    const { name, price, category } = req.body;
    const product = new Product({ name, price, category }); // Shorthand syntax for same key and value name
    // res.send(farm);
    farm.products.push(product);
    product.farm = farm;
    await farm.save();
    await product.save();
    // res.send(farm); // Mongoose automatically populates the farm document with the product information because we 
    // already have the product data with us which is directly used. In case we fetch the product information from
    // a database, Mongoose will only populate with the ID of the product.
    res.redirect(`/farms/${farm._id}`);
})

// Home Page
app.post('/farms', async (req, res) => {
    // res.send(req.body);
    const farm = new Farm(req.body);
    await farm.save();
    res.redirect('/farms');
});



// PRODUCT ROUTES - REMEMBER, ORDER MATTERS IN ROUTE HANDLER DEFINITIONS
app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category });
        res.render('products/index', { products, category });
    } else {
        const products = await Product.find({});
        res.render('products/index', { products, category: 'All' });
    }
})

app.get('/products/new', (req, res) => {
    res.render('products/new', { categories });
})


app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);

})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('farm', 'name'); // Populate the 'farm' field of the product
    // Document with only the 'farm.name' as an additional property to the 'farm._id'
    console.log(product);
    res.render('products/show', { product });
})

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories });
})

// We use a put request because we have the potential to updatie all the properties of the product document 
// in a single edit page. This is similar to a document replacement than document modification
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    // Validate and Update
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/products/${product._id}`)
})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

app.listen(3000, () => {
    console.log('APP IS LISTENING ON PORT 3000!!');
})