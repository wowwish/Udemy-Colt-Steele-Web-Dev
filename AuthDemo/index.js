const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const User = require('./models/user');
const session = require('express-session');

mongoose.connect('mongodb://localhost:27017/authDemo')
    .then(() => {
        console.log('MONGO CONNECTION OPEN!');
    }).catch(err => {
        console.log('OH NO, MONGO CONNECTION ERROR!');
        console.log(err);
    })


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); // For parsing request body using express's inbuuilt body parser.
app.use(session({ secret: 'notagoodsecret', resave: false, saveUninitialized: false }))


//  MIDDLEWARE FOR LOGIN AND AUTHENTICATION
const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login'); // Note that this return statement will prevent next() from being called
    }
    next();
}


app.get('/', (req, res) => {
    res.send('THIS IS THE HOME PAGE');
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', async (req, res) => {
    // res.send(req.body);
    const { username, password } = req.body;
    // res.send(hash);
    const user = new User({ username, password });
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/');
})

// Remember that sessions create a signed cookie containing an ID to the session. If you create your own version of 
// this signed cookie, it wont be verified because the signature in the cookie will be different.   
app.get('/secret', requireLogin, (req, res) => {
    res.render('secret');
})

app.get('/topsecret', requireLogin, (req, res) => {
    res.send('TOP SECRET!!');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', async (req, res) => {
    // res.send(req.body);
    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.redirect('/secret');
    } else {
        res.redirect('/login');
    }
})


app.post('/logout', (req, res) => {
    req.session.user_id = null; // Set the user_id to null so the secret page cannot be accessed again
    // req.session.destroy(); // destroy the entire 'req.session' object and all properties associated with it
    res.redirect('/login');
})

app.listen(3000, () => {
    console.log('Serving app on localhost:3000');
})