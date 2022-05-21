/* 

Flash messages are stored in the session. First, setup sessions as usual by enabling cookieParser and session 
middleware. Then, use flash middleware provided by connect-flash.

var flash = require('connect-flash');
var app = express();

app.configure(function() {
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session({ cookie: { maxAge: 60000 }}));
  app.use(flash());
});

With the flash middleware in place, all requests will have a req.flash() function that can be used for flash messages.

app.get('/flash', function(req, res){
  // Set a flash message by passing the key, followed by the value, to req.flash().
  req.flash('info', 'Flash is back!')
  res.redirect('/');
});

app.get('/', function(req, res){
  // Get an array of flash messages by passing the key to req.flash()
  res.render('index', { messages: req.flash('info') });
});

*/


const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');


// configure session - every request object will have a 'session' property available once this is configured and used
// It also creates a signed cookie when used called 'connect-sid' that is specific to each session and Browser.
// This is the default session id stored as a cookie.
// The 'resave' property when set to true, will force the session information to be saved in session store with every 
// request, even if there is no change in the session information
// The 'saveUninitialized' property 
const sessionOptions = { resave: false, secret: 'thisisnotagoodsecret', saveUninitialized: false };
app.use(session(sessionOptions));
// Setting the secret for the Session. This is usually done using environment variables in production.


// importing Mongoose Model from another file
const Product = require('./models/product');
const Farm = require('./models/farm');


mongoose.connect('mongodb://localhost:27017/flashDemo')
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
app.use(flash()); // This will add the req.flash() method to all requests and will help in showing flash messages.

const categories = ['fruit', 'vegetable', 'dairy'];


/* 


res.locals

Use this property to set variables accessible in templates rendered with res.render. The variables set on res.locals 
are available within a single request-response cycle, and will not be shared between requests.

In order to keep local variables for use in template rendering between requests, use app.locals instead.

This property is useful for exposing request-level information such as the request path name, authenticated user, 
user settings, and so on to templates rendered within the application.

app.use((req, res, next) => {
  // Make `user` and `authenticated` available in templates
  res.locals.user = req.user
  res.locals.authenticated = !req.user.anonymous
  next()
})



*/

// REMEMBER, ORDER MATTERS IN MIDDLEWARE DEFINITIONS AS WELL
// Set up a middleware for flash - This middleware runs on every request
app.use((req, res, next) => {
    res.locals.messages = req.flash('success'); // saving the flash message in 'res.locals' which is available to every template
    // rendered using this response. The scope of 'res.locals' is within each single response, it cannot be shared 
    // between responses.
    next();
});


// FARM ROUTES - REMEMBER, ORDER MATTERS IN ROUTE HANDLER DEFINITIONS

// Home Page - using flash messages because we redirect to here when a new farm is created
app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    // res.render('farms/index', { farms, messages: req.flash('success') }); // passing the flash message object using
    // its key
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

app.post('/farms', async (req, res) => {
    // res.send(req.body);
    const farm = new Farm(req.body);
    await farm.save();
    // SENDING FLASH MESSAGEs:
    // Set a flash message by passing the key, followed by the value, to req.flash().
    // Remember: flash messages should be set before result redirection / rendering.
    req.flash('success', 'Successfully made a new Farm');
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