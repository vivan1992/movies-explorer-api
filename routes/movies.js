const router = require('express').Router();

const { vlaidatorMovie, vlaidatorMovieId } = require('../middlewares/validate');

const { createMovie, getMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovie);

router.post('/', vlaidatorMovie, createMovie);

router.delete('/:movieId', vlaidatorMovieId, deleteMovie);

module.exports = router;
