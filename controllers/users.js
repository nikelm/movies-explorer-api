const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Не указан email или пароль');
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // console.log(user);
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign({ _id: user._id }, '494239edfbb6a610f4f70432aa79378257f95dc1c0348693e3483b036436a077', { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    })
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Не указан email или пароль');
  }
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с таким email уже зарегистрирован');
      }
      return bcrypt.hash(req.body.password, 10);
    })
    .then((hash) => {
      User.create({
        email: req.body.email,
        password: hash,
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
      })
        .then((user) => {
          User.findById(user._id)
            .then((data) => res.status(200).send(data));
        })
        .catch((err) => next(err));
    }).catch((err) => next(err));
};

const getProfile = (req, res, next) => User.findById(req.user._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    }
    return res.status(200).send(user);
  })
  .catch((err) => next(err));

const updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, email: req.body.email }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(200).send(user);
    })
    .catch((err) => next(err));
};

module.exports = {
  getProfile, createUser, updateProfile, login,
};
