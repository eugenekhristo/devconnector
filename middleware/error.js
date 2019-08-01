const winston = require('winston');

module.exports = (error, req, res, next) => {
  winston.error('', error);

  res
    .status(500)
    .send(
      `Internal server error. Something failed. Please try again! ${
        error.message
      }`
    );
};
