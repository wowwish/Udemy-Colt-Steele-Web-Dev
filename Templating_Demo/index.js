const express = require('express');
const app = express();
const path = require('path'); // can be used to set views path, comes bundled with nodejs
// https://nodejs.org/api/path.html

// import json data
const redditData = require('./data.json');
// console.log(redditData);

// express allows us to serve static files like .css, .js, images and audio/video files through its built-in 
// middleware express.static(). Refer https://expressjs.com/en/starter/static-files.html
// Middleware is a type of computer software that provides services to software applications beyond those 
// available from the operating system. It can be described as "software glue" 
app.use(express.static(path.join(__dirname, 'public'))); // using path,join(__dirname, 'public') allows you to serve
// the static assests in 'public' correctly even when you launch 'node index.js' from a different directory.
// __dirname corresponds to the directory where this script is located.
// Since we have the public directory which has the app.css, when we reference this file as the stylesheet in the
// link tag of the html head, we give the path relative to public which will be '/app.css'

// You can group your assets into a single directory and serve the top level directory like so:
// public
//  /css
//  /js
//  /imgs

// Or you can also server assets from their individual directories like so:

// /css
// /js
// /imgs

// Assigns setting name to value. You may store any value that you want, but certain names can be used to configure the behavior 
// of the server. Calling app.set('foo', true) for a Boolean property is the same as calling app.enable('foo'). 
// Similarly, calling app.set('foo', false) for a Boolean property is the same as calling app.disable('foo').
// Retrieve the value of a setting with app.get().
// app.set('title', 'My Site')
// app.get('title') // "My Site"
// READ: http://expressjs.com/en/api.html#app.set

// Allow our express app to support embedded JS. You need to install ejs using 'npm i ejs'. IF esj is installed,
// express will automatically require that package when the app.set command below is executed
// By default, the templates are ssearched for in the 'views' sub-directory within your npm init directory.
// You can explicitly change the directory where your template views are stored using:
// app.set('views', <path / array of paths>)
// or using the 'path' package - app.set('views', path.join(__dirname, '/views')). Here, '__dirname' points to the directory with this file 
// Using app.set('views', path.join(__dirname, '/views')) allows use to launch index.js from any directory 
// Using relattive/absolute paths for index.js and the ejs templates from views will be correctly picked. This allows
// you to launch index.js from anywhere using 'node index.js'
// For embedded JS, all its template files will have the suffix '.ejs'
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    //     res.render() renders a view and sends the rendered HTML string to the client. Optional parameters:

    //     - locals: an object whose properties define local variables for the view.
    //     - callback: a callback function. If provided, the method returns both the possible error and rendered string, 
    //     but does not perform an automated response. When an error occurs, the method invokes next(err) internally.

    // The view argument is a string that is the file path of the view file to render. This can be an absolute path, 
    // or a path relative to the views setting. If the path does not contain a file extension, then the view engine setting determines 
    // the file extension. If the path does contain a file extension, then Express will load the module for the specified template engine 
    // (via require()) and render it using the loaded module’s __express function.
    // pass a local variable to the view
    // res.render('user', { name: 'Tobi' }, function (err, html) {
    //     // ...
    // })



    // app.render() eturns the rendered HTML of a view via the callback function. It accepts an optional parameter that is an object 
    // containing local variables for the view. It is like res.render(), except it cannot send the rendered view to the client on its own.
    // app.render('email', function (err, html) {
    //     // ...
    //   })

    //   app.render('email', { name: 'Tobi' }, function (err, html) {
    //     // ...
    //   })
    res.render('home'); // rendering the 'home.ejs' file in from the default 'views' sub-directory
    // This works only if you run 'node index.js' from within the same directory where you installed all the packages 
    // and where the 'views' sub-direcotory is also located. If you run the app from somewhere else by giving the full path / relative path
    // to 'index.js' like 'node /home/user/test/index.js', then you have to explicitly set the 'views' directory path using app.set('views', 'path')
    // Now if you go to 'localhost:3000' , you will see the rendering of 'home.ejs'. Express looks for the 'views' sub-dir from wherever
    // you run the app launching code.
})

// Create a route that generates a random number and render it using ejs templating. The ejs file should again be in the views directory
// unless you explicitly set the path to the view templates using app.set('views', path)
//  IT IS A GOOD PRACTICE TO KEEP THE LOGIC IN THE JS FILE AND ONLY DISPLAY THE RESULTS THROUGH EJS TEMPLATES BY PASSING THE 
// RESULTS FROM THE JS SCRIPT TO THE TEMPLATE WHEN RENDERING IT
app.get('/rand', (req, res) => {
    const num = Math.floor(Math.random() * 10) + 1;
    res.render('random.ejs', { bubbles: num }); // 'num' will be available inside the template as 'rand'
    // The second argument of res.render() is an object that will pass through variables from our JS script into the template under
    // the name that we specify as the key
    // We can also simply pass the variables under the same name to the template like so res.render('random.ejs', { num })
})

app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params;
    // If the subreddit name eists in our json file, print the contents of that part to the node console (terminal)
    const data = redditData[subreddit];
    // console.log(data);
    // Only works for subreddit titles: 'localhost:3000/r/soccer', 'localhost:3000/r/chicken', 'localhost:3000/r/mightyharvest' 
    // that are found in data.json Will throw error for other posts
    if (data) {
        // if data exists for the subreddit, then render the subreddit template
        res.render('subreddit', { ...data });
    } else {
        // If no data exists for the subreddit, render the notfound template
        res.render('notfound', { subreddit });
    }

})


app.get('/cats', (req, res) => {
    const cats = [
        'blue', 'Rocket', 'Monty', 'Stephanie', 'Winston'
    ]
    res.render('cats', { allCats: cats });
})

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000');
})