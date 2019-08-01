const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');

const db = async () => {
  await mongoose.connect(config.get('mongodbUri'), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  });

  winston.info(`Connected to MongoDB server...`);
};

module.exports = db;
