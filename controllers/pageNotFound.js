const NotFoundError = require('../errors/NotFoundError');

module.exports.pageNotFound = (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
};
