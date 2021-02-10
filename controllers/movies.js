const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const creatMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
  } = req.body;

  if (!country || !director || !duration
    || !year || !description || !image
    || !trailer || !nameRU || !nameEN || !thumbnail) {
    throw new BadRequestError('Не заполнено одно из полей');
  }
  return Movie.create({ owner: req.user._id, ...req.body })
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch((err) => next(err));
};

const deleteMovie = (req, res, next) => {
  Movie.deleteOne({ _id: req.params.id, owner: req.user._id })
    .then((movie) => {
      if (movie.n === 0) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      return res.status(200).send(movie);
    })
    .catch((err) => next(err));
};

module.exports = {
  creatMovie, deleteMovie,
};
