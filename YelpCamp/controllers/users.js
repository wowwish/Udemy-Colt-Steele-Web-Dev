const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    // res.send(req.body);
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password); // all additional user properties are added
        // and the object with additional properties along with the username, is sent to the register() method added to 
        // the model by password.
        /* register(user, password, cb): Convenience method to register a new user instance with a given password. 
        Checks if username is unique. See login example. */
        // console.log(registeredUser);


        /* 
        
        Passport exposes a login() function on req (also aliased as logIn()) that can be used to establish a login session.
    
      req.login(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/users/' + req.user.username);
      });
    
      When the login operation completes, user will be assigned to req.user.
    
      Note: passport.authenticate() middleware invokes req.login() automatically. This function is primarily used when 
      users sign up, during which req.login() can be invoked to automatically log in the newly registered user.
        
        */

        req.login(registeredUser, err => {
            if (err) return next(err);
            // The two statements below are run only when err is undefined because we have a return statement in the if block
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        }); // invoked to auto login the registered user
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    // passport.authenticate is the authentication middleware from passport. The strategy used in this case is 'local'.
    // However, we can have several strategies used parallely by passing an array of strategy names to password.authenticate()
    // The second argument to passport.authenticate() is an object specifying options such as flashing error messages, 
    // redirecting to a particular route when there the authentication fails etc.
    req.flash('success', 'Welcome Back!');
    // This redirection Url will become an issue when using passport version 0.6.0
    // need to find a new way to achieve this functionality in passport 0.6.0
    // Refer: https://github.com/jaredhanson/passport/issues/904
    const redirectUrl = req.session.returnTo || '/campgrounds'; // redirect to 'req.session.returnTo' if it exists, else 
    delete req.session.returnTo; // delete this session info to free up session store, because it is now stored in a variable
    // redirect to '/campgrounds'
    // console.log(redirectUrl);
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    /* 
    
    Passport exposes a logout() function on req (also aliased as logOut()) that can be called from any route handler 
    which needs to terminate a login session. Invoking logout() will remove the req.user property and clear the login 
    session (if any).
    
    It is a good idea to use POST or DELETE requests instead of GET requests for the logout endpoints, in order to 
    prevent accidental or malicious logouts.
  
    Since version 0.6.0 (which was released only a few days ago by the time of writing this), req.logout is asynchronous. 
    This is part of a larger change that averts session fixation attacks.
  
    req.logout() is now an asynchronous function, whereas previously it was synchronous. For instance, a logout route 
    that was previously:
  
  app.post('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
  });
  
  should be modified to:
  
  app.post('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });
  
  It is necessary in order to improve the security of how sessions are managed during logout. 
  
    */
    req.logout(); // We use passport version 0.5.0, So 'req.logout()' is still synchronous code that does not require
    // a callback
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
}