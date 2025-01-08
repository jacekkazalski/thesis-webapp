const CustomError = require('../utils/customError')
const sendErrorDev = (err, res) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const message = err.message;
    const stack = err.stack;

    res.status(statusCode).json({
        status,
        message,
        stack
    })
}
const sendErrorProd = (err, res) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const message = err.message;
    const stack = err.stack;

    if (err.isOperational) {
        return res.status(statusCode).json({
            status,
            message
        })
    }
    // Unhandled error
    console.log(err.name, err.message, stack);
    return res.status(statusCode).json({
        status: 'error',
        message: 'Something went wrong'
    })
    
}
const errorHandler = (err, req, res, next) => {
    if (err.name === 'SequelizeUniqueConstraintError') {
        err = new CustomError(err.errors[0].message, 400);
    }
    if(err.name === 'SequelizeValidationError') {
        err = new CustomError(err.errors[0].message, 400);
    }
    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }
    sendErrorProd(err, res);
}

module.exports = errorHandler;