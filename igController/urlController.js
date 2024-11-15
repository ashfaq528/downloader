const youtubeDl = require('youtube-dl-exec');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const id = uuidv4();
const filterDataObj = require('./filterDataObject');
const catchAsyncErrors = require('./../Utils/asyncErrorHandler');
const AppError = require('../Utils/AppError');

const unixTimeStemp = Math.floor(
  Date.now() + (30 * 24 * 60 * 60 * 1000) / 1000
);

const proxyUrl = process.env.PROXY_URL;

exports.downloder = catchAsyncErrors(async (req, res, next) => {
  // 1) Get url and cookie from server
  const url = req.body.url;
  const planeCookie = req.headers.cookie;
  var fileName = `cookies--${id}.txt`;
  exports.dpFileName = fileName;
  // // Setup Netscape format
  if (req.headers.cookie && proxyUrl !== undefined) {
    const netScape = '# Netscape HTTP Cookie File';
    const cookie = `${netScape}\n.instagram.com\tTRUE\t/\tFALSE\t${unixTimeStemp}\tsessionid\t${planeCookie}`;
    fs.writeFile(fileName, cookie, 'utf8', () => {
      console.log('File Written successfuly');
    });
    // 2) Pass url and cookies to YOUTUBE DL EXAC
    var data = await youtubeDl(url, {
      proxy: proxyUrl,
      dumpSingleJson: true,
      cookies: fileName,
    });
  } else {
    var data = await youtubeDl(url, {
      proxy: proxyUrl,
      dumpSingleJson: true,
    });
  }

  // Delete Cookie File
  filterDataObj.deleteCookiefile(fileName);

  // 3) Filter Response
  if (data.formats) {
    const urlAndType = await filterDataObj.getTypeAndUrl(data.formats);

    // Ready Response for Sends
    const finalResponse = await filterDataObj.finalAction(
      urlAndType,
      data.thumbnails[1]
    );
    // // 4) Send Response to the user
    res.status(200).json({
      status: 200,
      result: finalResponse,
    });
  } else if (data._type === 'playlist') {
    const err = new AppError('Images might not available', 403);
    return next(err);
  } else if (data.entries.formats) {
    const urlAndType = await filterDataObj.getTypeAndUrl(
      data.entries[0].formats
    );
    const finalResponse = await filterDataObj.finalAction(
      urlAndType,
      data.entries[0].thumbnails[1]
    );
    // // 4) Send Response to the user
    res.status(200).json({
      status: 200,
      result: finalResponse,
    });
  }
});
