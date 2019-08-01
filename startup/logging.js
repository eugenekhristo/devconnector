require('express-async-errors');
const winston = require('winston');
const { transports, exceptions, format } = winston;
const { combine, timestamp, label, prettyPrint, printf } = format;
require('winston-mongodb');
const path = require('path');
const config = require('config');

module.exports = () => {
  const myFormat = printf(({ level, message, label, timestamp, stack }) => {
    return `${timestamp} [${label}] ${level}: ${message}. ${
      stack ? 'Stack: ' + stack : ''
    }`;
  });

  exceptions.handle(
    new transports.Console({
      format: combine(
        label({ label: 'VIDLY' }),
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        prettyPrint()
      )
    }),
    new transports.File({
      filename: path.resolve(__dirname, '..', 'log', 'startup-exceptions.log'),
      format: combine(
        label({ label: 'VIDLY' }),
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        myFormat
      )
    })
  );

  process.on('unhandledRejection', error => {
    throw error;
  });

  winston.add(
    new transports.Console({
      format: combine(
        label({ label: 'VIDLY' }),
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        prettyPrint()
      )
    })
  );

  winston.add(
    new transports.File({
      filename: path.resolve(__dirname, '..', 'log', 'loginfo.log'),
      level: 'error',
      format: combine(
        label({ label: 'VIDLY' }),
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        myFormat
      )
    })
  );

  if (process.env.NODE_ENV === 'production') {
    winston.add(
      new transports.MongoDB({
        db: config.get('mongodbUri'),
        level: 'error'
      })
    );
  }
};
