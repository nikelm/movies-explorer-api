const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovie = (req, res, next) => Movie.find({})
  .then((movies) => res.status(200).send(movies))
  .catch((err) => next(err));

const createMovie = (req, res, next) => {
  const { movieId } = req.body;

  return Movie.findOne({ movieId })
    .then((movie) => {
      if (movie) {
        throw new ConflictError('Этот фильм уже добавлен!');
      }
      Movie.create({
        owner: req.user._id,
        country: req.body.country,
        director: req.body.director,
        duration: req.body.duration,
        movieId: req.body.movieId,
        year: req.body.year,
        description: req.body.description,
        image: req.body.image,
        trailer: req.body.trailer,
        nameRU: req.body.nameRU,
        nameEN: req.body.nameEN,
        thumbnail: req.body.thumbnail,
      })
        .then((movieData) => {
          res.status(200).send(movieData);
        })
        .catch((err) => next(err));
    }).catch((err) => next(err));
};

const deleteMovie = (req, res, next) => {
  Movie.findById({ _id: req.params.id })
    .then((film) => {
      if (film.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалить чужой фильм!');
      }
      Movie.deleteOne({ _id: req.params.id, owner: req.user._id })
        .then((movie) => {
          if (movie.n === 0) {
            throw new NotFoundError('Такого фильма нет!');
          }
          return res.status(200).send(movie);
        })
        .catch((err) => next(err));
    }).catch((err) => next(err));
};

module.exports = {
  createMovie, deleteMovie, getMovie,
};
