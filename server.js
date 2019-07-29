require('colors');
const express = require('express');
const connectDb = require('./config/connectDb');

const app = express();
connectDb();

app.get('/', (req, res) => {
  res.send('HI!!!!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`NodeJS server is running on PORT of ${PORT}...`.cyan)
);
