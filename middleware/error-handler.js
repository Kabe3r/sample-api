// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {

  // Mongoose Errors

  let CustomError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later'
  }

  // Validation Errors
  if (err.name === 'ValidationError') {
    // console.log(Object.values(err.errors));
    CustomError.msg = Object.values(err.errors)
                      .map(item => item.message)
                      .join(', ');
    CustomError.statusCode = 400;                  
  }

  // Duplicate (Email)
  if (err.code && err.code === 11000) {
    CustomError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
    CustomError.statusCode = 400;
  }

  // Cast Error
  if (err.name === 'CastError') {
    CustomError.msg = `No item found with id : ${err.value}`
    CustomError.statusCode = 404
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(CustomError.statusCode).json({ msg: CustomError.msg  })
}

module.exports = errorHandlerMiddleware