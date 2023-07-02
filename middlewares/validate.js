const { celebrate, Joi } = require('celebrate');
const { urlValidator } = require('./urlValidator');

const vlaidatorCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});

const vlaidatorLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const vlaidatorUserMe = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const vlaidatorMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(urlValidator, 'urlValidator'),
    trailerLink: Joi.string().required().custom(urlValidator, 'urlValidator'),
    thumbnail: Joi.string().required().custom(urlValidator, 'urlValidator'),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const vlaidatorMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  vlaidatorCreateUser,
  vlaidatorLogin,
  vlaidatorUserMe,
  vlaidatorMovie,
  vlaidatorMovieId,
};

// {
//   "country": "test",
//   "director": "test",
//   "duration": "60",
//   "year": "1992",
//   "description": "test",
//   "image": "https://test.com",
//   "trailerLink": "https://test.com",
//   "thumbnail": "https://test.com",
//   "movieId": "93920",
//   "nameRU": "test",
//   "nameEN": "test"
// }
