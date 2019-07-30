const { check } = require('express-validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userValidation = [
  check('name')
    .exists()
    .withMessage('Name field is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  check('email', 'Please provide a valid email').isEmail(),
  check(
    'password',
    'Please provide a password with 6 or more characters'
  ).isLength({ min: 6, max: 255 })
];

const mongooseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 255
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024
  },
  avatar: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

mongooseSchema.methods.generateJWT = function() {
  return jwt.sign({ user: { id: this.id } }, config.get('secretKeyJWT'), {
    expiresIn: 3600000 // 41 days
  });
};

const User = mongoose.model('User', mongooseSchema);

module.exports = { User, userValidation };
