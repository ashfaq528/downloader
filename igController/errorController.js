const fileName = require('./../igController/urlController');
const deleteCookie = require('./filterDataObject');
const deleteFile = (cookieFile) => {
  deleteCookie.deleteCookiefile(cookieFile);
};
const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};
const prodErrors = (res, error) => {
  if (error.isOperational === true) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  }
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
  });
};
module.exports = (error, req, res, next) => {
  if (fileName.dpFileName !== undefined) {
    console.log(fileName.dpFileName);
    deleteFile(fileName.dpFileName);
  }
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    devErrors(res, error);
  } else if (process.env.NODE_ENV === 'production') {
    if (error.message.includes('502 Bad Gateway')) {
      error.statusCode = 400;
      error.status = 'Invalid url';
    }
    if (error.message.includes('HTTP Error 400')) {
      error.statusCode = 404;
      error.message = 'Please enter a valid Url';
    }
    if (
      !error.message.includes('HTTP Error 400') &&
      error.message.includes('unable to extract username')
    ) {
      error.statusCode = 401;
      error.message = 'Private Video: Please Login to download this Video';
    }
    if (error.message.includes('407 Proxy Authentication')) {
      error.statusCode = 400;
      error.message = 'Poxy authentication failed';
    }
    if (error.message.includes(`(reading ${'length'})`)) {
      error.statusCode = 403;
      error.message = 'Forbidden: The server is refusing access to the image.';
    }
    if (error.message.includes('[instagram:story]')) {
      error.statusCode = 401;
      error.message = 'Instagram Story: Please Login and Follow to download';
    }
    if (error.message.includes('Unable to extract video url')) {
      error.statusCode = 403;
      error.message = 'Image not Found';
    }
    if (error.message.includes('No video formats found')) {
      error.statusCode = 403;
      error.message = 'Image might not available';
    }
    prodErrors(res, error);
  }
};
