const fs = require('fs');
exports.deleteCookiefile = (fileName) => {
  fs.unlink(fileName, () => {
    console.log('File Deleted Succesfully');
  });
};

exports.getTypeAndUrl = (data) => {
  let results = 50;
  let index = 0;
  let typeAndUrl = {};
  //   console.log(data.length);
  //   console.log(data);
  for (let i = 0; i < data.length; i++) {
    if (data[i].ext !== 'm4a') {
      if (data[i].width > results && !data[i].format.includes('dash')) {
        index = i;
        results = data[i].width;
      }
    }
  }
  typeAndUrl = {
    videoUrl: data[index].url,
    type: data[index].video_ext,
  };
  console.log(results, index);
  return typeAndUrl;

  //   console.log(data);
  //   return results;
};
exports.finalAction = (typeUrl, tnail) => {
  let responseObject = {};
  responseObject = {
    ...typeUrl,
    thumbnailUrl: tnail.url,
  };
  return responseObject;
};
