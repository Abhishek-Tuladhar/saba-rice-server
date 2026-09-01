const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose duplicate key error (e.g. email already exists)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `This ${field} is already in use.`;
  }

  // Mongoose validation error (e.g. invalid email format, missing required field)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(' ');
  }

  // Mongoose invalid ObjectId / cast error
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for ${err.path}.`;
  }

  res.status(statusCode).json({
    error: message,
  });
};

module.exports = errorHandler;