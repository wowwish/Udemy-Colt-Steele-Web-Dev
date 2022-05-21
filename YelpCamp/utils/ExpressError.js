class ExpressError extends Error {// inherit the built-in Error Class
    constructor(message, statusCode) {
        super(); // calling the Parent Class constructor
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;