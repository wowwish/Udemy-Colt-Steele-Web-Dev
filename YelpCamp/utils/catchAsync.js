// Creating a wrapper function with an async function as parameter, that catches errors and sends them to the 
// error-handling middleware

module.exports = func => {
    return (req, res, next) => { // A new function is returned, that calls the async function on req, res, next and 
        func(req, res, next).catch(next); // catches raised errors and passes them to a next() call for error-handling
        // via custom-middleware
    }
}