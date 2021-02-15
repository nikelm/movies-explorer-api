const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getProfile, updateProfile, login, createUser,
} = require('../controllers/users');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.use(auth);

router.get('/users/me', getProfile);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).pattern(/^[а-яА-Яa-zA-Z0-9\-\s]+$/),
    email: Joi.string().lowercase().email(),
    password: Joi.string().min(8).pattern(/^[a-zA-Z0-9\-\s]+$/),
  }),
}), updateProfile);

module.exports = router;
