const isURL = require('validator/lib/isURL');
const ValidationError = require('../errors/ValidationError');

module.exports.urlValidator = (url) => {
  if (isURL(url) !== true) {
    throw new ValidationError('Некорректная ссылка');
  } else return url;
};
