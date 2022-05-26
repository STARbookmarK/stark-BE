import ApiError from '../utils/ApiError.js';
import httpStatus from 'http-status';

const errorConverter = (err, req, res, next) => {
  let error = err;
  if(!(error instanceof ApiError)){
    const statusCode = error.statusCode ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const { statusCode, message } = err;
  res.status(statusCode).json(message);
};

export default {
  errorConverter,
  errorHandler
};