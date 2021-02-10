const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isUrl(v);
      },
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isUrl(v);
      },
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isUrl(v);
      },
    },
  },
  owner: {
    type: String,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^[а-яА-ЯёЁ0-9]+$/.test(v);
      },
    },
  },
  nameEN: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^[a-zA-Z0-9]+$/.test(v);
      },
    },
  },
});

const movieModel = mongoose.model('movie', movieSchema);

module.exports = movieModel;
