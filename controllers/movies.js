const { default: mongoose } = require('mongoose');
const Movie = require('../models/movies');

const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const NoRulesError = require('../errors/NoRulesError');

const {
  invalidDataText,
  noRulesText,
  movieIdNotFoundText,
} = require('../errors/errorsText');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const { _id } = req.user;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: _id,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(invalidDataText));
      } else {
        next(err);
      }
    });
};

module.exports.getMovie = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .populate('owner')
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError(movieIdNotFoundText);
    })
    .then((movie) => {
      if (JSON.stringify(movie.owner) !== JSON.stringify(req.user._id)) {
        throw new NoRulesError(noRulesText);
      }
      return movie.deleteOne()
        .then(() => res.send(movie));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new ValidationError(invalidDataText));
      } else {
        next(err);
      }
    });
};
