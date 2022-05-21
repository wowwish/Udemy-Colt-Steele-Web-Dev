
// Creating a custom error Class
// Note that the default error handler will look for a status property and header property of an object of this 
// Error class, and use it to send an error response.
class appError extends Error {
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
    }
}


module.exports = appError;