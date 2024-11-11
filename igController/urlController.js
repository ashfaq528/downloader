const express = require('express');
const youtubeDl = require('youtube-dl-exec');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const id = uuidv4();
const filterDataObj = require('./filterDataObject');
const catchAsyncErrors = require('./../Utils/asyncErrorHandler');
const AppError = require('../Utils/AppError');
const { error } = require('console');

const unixTimeStemp = Math.floor(
  Date.now() + (30 * 24 * 60 * 60 * 1000) / 1000
);

const proxyUrl = process.env.PROXY_URL;
console.log('line 35', proxyUrl);

exports.cookieFile = (name) => {
  let nameofFile = name;
  console.log(nameofFile);
  return nameofFile;
};

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
    console.log(cookie);
    fs.writeFile(fileName, cookie, 'utf8', () => {
      console.log('File Written successfuly');
    });
    console.log('line 62', process.env.PROXY_URL);
    // 2) Pass url and cookies to YOUTUBE DL EXAC
    var data = await youtubeDl(url, {
      proxy: proxyUrl,
      dumpSingleJson: true,
      cookies: fileName,
    });

    console.log('Proxy works fine');
  } else {
    var data = await youtubeDl(url, {
      proxy: proxyUrl,
      dumpSingleJson: true,
    });
    console.log('no proxy');
  }

  // Delete Cookie File
  filterDataObj.deleteCookiefile(fileName);
  if (data.formats) {
    console.log('formats');
    const urlAndType = await filterDataObj.getTypeAndUrl(data.formats);
    console.log('line 74:', urlAndType);

    // 3) Filter Response
    // Get Profile name and Post title

    // Ready Response for Sends
    const finalResponse = await filterDataObj.finalAction(
      urlAndType,
      data.thumbnails[1]
    );
    console.log(finalResponse);
    // // 4) Send Response to the user
    res.status(200).json({
      status: 200,
      result: finalResponse,
    });
  } else if (data.entries.length === 0) {
    const err = new AppError('Post not Found', 404);
    return next(err);
  } else if (data.entries) {
    console.log('formats:', data.entries[0].formats);
    const urlAndType = await filterDataObj.getTypeAndUrl(
      data.entries[0].formats
    );
    console.log('line 76:', urlAndType);
    const finalResponse = await filterDataObj.finalAction(
      urlAndType,
      data.entries[0].thumbnails[1]
    );
    console.log(finalResponse);
    // // 4) Send Response to the user
    res.status(200).json({
      status: 200,
      result: finalResponse,
    });
  }
});

exports.imageDownloaderTest = async (req, res) => {
  try {
    const url = req.body.url;
    const dataImage = await youtubeDl(url, {
      dumpSingleJson: true,
    });
    if (dataImage.entries.length === 0) {
    }
    res.status(200).json({
      status: 'Succes',
      result: dataImage,
    });
  } catch (error) {
    res.send(error);
  }
};

// .entries[0].formatsresult.entries[0].thumbnails
