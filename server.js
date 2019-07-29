require('colors');
const express = require('express');
const connectDb = require('./config/connectDb');

const app = express();
connectDb();

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`NodeJS server is running on PORT of ${PORT}...`.cyan)
);
