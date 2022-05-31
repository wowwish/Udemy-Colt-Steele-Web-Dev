const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const multer = require('multer'); // multer package provides middleware for uploading files through forms
const { storage } = require('../cloudinary/'); // NodeJS automatically picks up the 'index.js' file
// const upload = multer({ dest: 'uploads/' }); // Stores the images locally
const upload = multer({ storage }); // stores images in the configured cloudinary storage
// getting all route handler function from the controllers directory
const campgrounds = require('../controllers/campgrounds');

// destructuring the schema from the imported object
const { joiValidationSchema } = require('../validationSchemas');

/* 


router.route(path):

Returns an instance of a single route which you can then use to handle HTTP verbs with optional middleware. 
Use router.route() to avoid duplicate route naming and thus typing errors.

Building on the router.param() example above, the following code shows how to use router.route() to specify various 
HTTP method handlers.

const router = express.Router()

router.param('user_id', (req, res, next, id) => {
  // sample user, would actually fetch from DB, etc...
  req.user = {
    id,
    name: 'TJ'
  }
  next()
})

router.route('/users/:user_id')
  .all((req, res, next) => {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
    next()
  })
  .get((req, res, next) => {
    res.json(req.user)
  })
  .put((req, res, next) => {
  // just an example of maybe updating the user
    req.user.name = req.params.name
    // save user ... etc
    res.json(req.user)
  })
  .post((req, res, next) => {
    next(new Error('not implemented'))
  })
  .delete((req, res, next) => {
    next(new Error('not implemented'))
  })

This approach re-uses the single /users/:user_id path and adds handlers for various HTTP methods.

NOTE: When you use router.route(), middleware ordering is based on when the route is created, not when method 
handlers are added to the route. For this purpose, you can consider method handlers to belong to the route to which 
they were added.


*/

// ORDER OF ROUTE-HANDLERS MATTER. '/:id' would match 'new' as 'req.params.id' if its route-handler is declared before 
// '/new' route-handler
router.route('/')
  .get(catchAsync(campgrounds.index))
  // using wrapper function for error handling
  // validateCampground should be called after multer uploads the imaeges from the form and creates an array of objects
  // for the images in req.files. 
  .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));
// .post(upload.array('image'), (req, res) => { // The uploaded file has the name attribute set to 'image'
// upload.single() handles single file uploads and upload.array() handles multiple uploaded files
// Upon submitting a new campground, you will see a new 'uploads' directory created locally, having the encoded
// image files
// console.log(req.body, req.files); // single file uploades will be stored in 'req.file' object. Multiple files will be
// stored in 'req.files' object
// res.send('IT WORKED!!');
// });

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
  .get(catchAsync(campgrounds.showCampground))
  .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
  .delete(isLoggedIn, campgrounds.deleteCampground);


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));



module.exports = router;