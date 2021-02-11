require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(bodyParser.json());
app.use(requestLogger);

app.get('/signup', (req, res, next) => {
  try {
    if (req.body || !req.body) {
      throw new NotFoundError('Запрашиваемый ресурс не найден');
    }
  } catch (err) {
    next(err);
  }
});

app.get('/signin', (req, res, next) => {
  try {
    if (req.body || !req.body) {
      throw new NotFoundError('Запрашиваемый ресурс не найден');
    }
  } catch (err) {
    next(err);
  }
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use(auth);

app.use('/', usersRouter);
app.use('/', moviesRouter);

app.use('*', (req, res, next) => {
  try {
    if (req.body || !req.body) {
      throw new NotFoundError('Запрашиваемый ресурс не найден');
    }
  } catch (err) {
    next(err);
  }
});

app.use(errorLogger);

app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
    status: statusCode,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
