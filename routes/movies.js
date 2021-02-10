const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovie, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/movies', getMovie);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).max(30).required()
      .pattern(/^[а-яА-ЯёЁa-zA-Z0-9\-\s]+$/),
    director: Joi.string().min(2).max(30).required()
      .pattern(/^[а-яА-ЯёЁa-zA-Z0-9\-\s]+$/),
    duration: Joi.string().min(2).max(30).required()
      .pattern(/^[а-яА-ЯёЁa-zA-Z0-9\-\s]+$/),
    year: Joi.string().min(2).max(30).required()
      .pattern(/^[а-яА-ЯёЁa-zA-Z0-9\-\s]+$/),
    description: Joi.string().min(2).max(30).required()
      .pattern(/^[а-яА-ЯёЁa-zA-Z0-9\-\s]+$/),
    image: Joi.string().required().pattern(/(http|https)[-a-zA-Z0-9@:%_\\+.~#?&\\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\\+.~#?&\\/=]*)?/),
    trailer: Joi.string().required().pattern(/(http|https)[-a-zA-Z0-9@:%_\\+.~#?&\\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\\+.~#?&\\/=]*)?/),
    thumbnail: Joi.string().required().pattern(/(http|https)[-a-zA-Z0-9@:%_\\+.~#?&\\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\\+.~#?&\\/=]*)?/),
    nameRU: Joi.string().required().pattern(/^[а-яА-ЯёЁ0-9]+$/),
    nameEN: Joi.string().required().pattern(/^[a-zA-Z0-9]+$/),
  }),
}), createMovie);

router.delete('/movies/:id', celebrate({
  body: Joi.object().keys({

  }),
}), deleteMovie);
