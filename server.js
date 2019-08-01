require('colors');
const express = require('express');
const winston = require('winston');
const app = express();

require('./startup/logging')();
require('./startup/config')();
require('./startup/db')();
require('./startup/routes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  winston.info(`NodeJS server is running on PORT of ${PORT}...`)
);
