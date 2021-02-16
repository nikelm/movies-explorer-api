const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const AuthError = require('../errors/AuthError');

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((userData) => {
      if (!userData) {
        throw new AuthError('Неверно указан email или пароль');
      }
      return bcrypt.compare(password, userData.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неверно указан email или пароль');
          }
          return userData;
        }).then((user) => {
          // аутентификация успешна! пользователь в переменной user
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );
          // вернём токен
          res.send({ token });
        }).catch((err) => next(err));
    }).catch((err) => next(err));
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
    return res.status(200).send({ name: user.name, email: user.email });
  })
  .catch((err) => next(err));

const updateProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((data) => {
      if (req.body.name && !req.body.email) {
        return User.findByIdAndUpdate(req.user._id, { name: req.body.name }, {
          new: true,
          runValidators: true,
        }).then((user) => {
          if (!data) {
            throw new NotFoundError('Нет пользователя с таким id');
          }
          return res.status(200).send({ name: user.name });
        })
          .catch((err) => next(err));
      }
      if (req.body.email && !req.body.name) {
        return User.findByIdAndUpdate(req.user._id, { email: req.body.email }, {
          new: true,
          runValidators: true,
        }).then((user) => {
          if (!user) {
            throw new NotFoundError('Нет пользователя с таким id');
          }
          return res.status(200).send({ email: user.email });
        })
          .catch((err) => next(err));
      }
      if (!req.body.email && !req.body.name && req.body.password) {
        return User.findById(req.user._id)
          .then(() => bcrypt.hash(req.body.password, 10))
          .then((pass) => {
            User.findByIdAndUpdate(req.user._id, { password: pass }, {
              new: true,
              runValidators: true,
            }).then((user) => {
              if (!user) {
                throw new NotFoundError('Нет пользователя с таким id');
              }
              return res.status(200).send({ message: 'Пароль успешно изменен!' });
            })
              .catch((err) => next(err));
          }).catch((err) => next(err));
      }
      return User.findByIdAndUpdate(req.user._id, { name: req.body.name, email: req.body.email }, {
        new: true,
        runValidators: true,
      }).then((user) => {
        if (!user) {
          throw new NotFoundError('Нет пользователя с таким id');
        }
        return res.status(200).send({ name: user.name, email: user.email });
      })
        .catch((err) => next(err));
    });
};

module.exports = {
  getProfile, createUser, updateProfile, login,
};
