require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');
const ErrorHandler = require('./errors/ErrorHandler');

const { PORT = 3003, MONGO_DB, NODE_ENV } = process.env;

mongoose.connect(NODE_ENV === 'production' ? MONGO_DB : 'mongodb://localhost:27017/testdb', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(helmet());
app.use(cors());

app.use(bodyParser.json());
app.use(requestLogger);

app.get('/signup', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.get('/signin', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use('/', usersRouter);
app.use('/', moviesRouter);

app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);

app.use(errors()); // обработчик ошибок celebrate

app.use(ErrorHandler); // Централизованный обработчик ошибок

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
