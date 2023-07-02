const NotFoundError = require('../errors/NotFoundError');

const { notFoundText } = require('../errors/errorsText');

module.exports.pageNotFound = (req, res, next) => {
  next(new NotFoundError(notFoundText));
};
