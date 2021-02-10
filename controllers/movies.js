const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const getMovie = (req, res, next) => Movie.find({})
  .then((movies) => res.status(200).send(movies))
  .catch((err) => next(err));

const createMovie = (req, res, next) => {
  const { nameRU, nameEN } = req.body;

  return Movie.findOne({ nameRU, nameEN })
    .then((movie) => {
      if (movie) {
        throw new ConflictError('Этот фильм уже добавлен!');
      }
      Movie.create({
        owner: req.user._id,
        country: req.body.country,
        director: req.body.director,
        duration: req.body.duration,
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
  Movie.deleteOne({ _id: req.params.id, owner: req.user._id })
    .then((movie) => {
      if (movie.n === 0) {
        throw new NotFoundError('Такого фильма нет!');
      }
      return res.status(200).send(movie);
    })
    .catch((err) => next(err));
};

module.exports = {
  createMovie, deleteMovie, getMovie,
};
