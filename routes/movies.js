const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { getMovie, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/movies', getMovie);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).max(30).required()
      .pattern(/^[а-яА-ЯёЁa-zA-Z0-9\-\s]+$/),
    director: Joi.string().min(2).max(30).required()
      .pattern(/^[а-яА-ЯёЁa-zA-Z0-9\-\s]+$/),
    duration: Joi.number().required(),
    movieId: Joi.number().required(),
    year: Joi.string().min(2).max(30).required()
      .pattern(/^[а-яА-ЯёЁa-zA-Z0-9\-\s]+$/),
    description: Joi.string().min(2).required()
      .pattern(/^[а-яА-ЯёЁa-zA-Z0-9\-'"«»,.—\s]+$/),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value, { protocols: ['http', 'https'], require_tld: true, require_protocol: true })) {
        return value;
      }
      return helpers.message('ссылка на постер к фильму указана неверно');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value, { protocols: ['http', 'https'], require_tld: true, require_protocol: true })) {
        return value;
      }
      return helpers.message('ссылка на трейлер фильма указана неверно');
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value, { protocols: ['http', 'https'], require_tld: true, require_protocol: true })) {
        return value;
      }
      return helpers.message('ссылка мини-изображение постера к фильму указана неверно');
    }),
    nameRU: Joi.string().required().pattern(/^[а-яА-ЯёЁa-zA-Z0-9\-'"«»,.—\s]+$/),
    nameEN: Joi.string().required().pattern(/^[a-zA-Z0-9\-'"«»,.—\s]+$/),
  }),
}), createMovie);

router.delete('/movies/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
