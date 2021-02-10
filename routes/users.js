const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getProfile, updateProfile } = require('../controllers/users');

router.get('/users/me', getProfile);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .pattern(/^[а-яА-Яa-zA-Z0-9\-\s]+$/),
    email: Joi.string().lowercase().email().required(),
  }),
}), updateProfile);

module.exports = router;
