const crypto = require('crypto');
const catchAsyncErrors = require('./../Utils/asyncErrorHandler');
const AppError = require('./../Utils/AppError');
const { error } = require('console');

console.log(process.env.IV);
exports.headerKey = catchAsyncErrors(async (req, res, next) => {
  const encryptedText = req.headers.token;
  const key = process.env.KEY;
  const iv = process.env.IV;
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(key),
    Buffer.from(iv)
  );
  let decrypted = await decipher.update(encryptedText, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  const preTimestamp = decrypted.match(/\d+$/)[0] * 1;
  const newTimeStemp = Date.now();
  console.log(decrypted);
  // if (newTimeStemp - preTimestamp > 120000) {
  //   const err = new AppError('Route is not defined yet', 400);
  //   return next(err);
  // }
  return next();
});

// function decrypt(encryptedText, key, iv) {
//   const decipher = crypto.createDecipheriv(
//     'aes-256-cbc',
//     Buffer.from(key),
//     Buffer.from(iv)
//   );
//   let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
//   decrypted += decipher.final('utf8');
//   res.status(201).json({
//     status: 201,
//     result: decrypted,
//   });
// }

// const decryptedText = decrypt(token, key, iv);
// console.log('Decrypted Text:', decryptedText);
