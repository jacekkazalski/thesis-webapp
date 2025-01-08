// Wrapper for catching errors in async middlewares
const catchAsync = (fun) => {
    const errorHandler = (req, res, next) => {
        fun(req, res, next).catch(next)
    }

    return errorHandler;
}

module.exports = catchAsync;