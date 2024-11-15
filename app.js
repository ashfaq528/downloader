const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' });
const express = require('express');
const urlController = require('./igController/urlController');
const protect = require('./igController/protectedRoute');
const globalErrorHandler = require('./igController/errorController');
const AppError = require('./Utils/AppError');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.post('/api/v1/instaDown', protect.headerKey, urlController.downloder);
app.all('*', (req, res, next) => {
  const err = new AppError(`Can't find the ${req.originalUrl}`, 404);
  next(err);
});
app.use(globalErrorHandler);

module.exports = app;
