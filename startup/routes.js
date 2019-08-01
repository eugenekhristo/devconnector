const express = require('express');

module.exports = app => {
  app.use(express.json({ extended: false }));
  app.use('/api/users', require('./../routes/api/users'));
  app.use('/api/auth', require('./../routes/api/auth'));
  app.use('/api/profile', require('./../routes/api/profile'));
  app.use('/api/posts', require('./../routes/api/posts'));
  app.use(require('../middleware/error'));
};
