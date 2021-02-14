require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');
const ErrorHandler = require('./errors/ErrorHandler');

const { PORT = 3000, MONGO_DB } = process.env;

mongoose.connect(MONGO_DB, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(helmet());

app.use(bodyParser.json());
app.use(requestLogger);

app.get('/signup', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.get('/signin', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
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

app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);

app.use(errors()); // обработчик ошибок celebrate

app.use(ErrorHandler); // Централизованный обработчик ошибок

/*
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});
*/

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
