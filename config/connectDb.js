require('colors');
const mongoose = require('mongoose');
const config = require('config');

const connectDb = async () => {
  try {
    await mongoose.connect(config.get('mongodbUri'), {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log(`Connected to MongoDB server...`.yellow);
  } catch (error) {
    console.error(
      `Error happened while conencting to MongoDB server: ${error.message}...`
        .red
    );
  }
};

module.exports = connectDb;
