'use strict';
const video = require('./src/video');
const image = require('./src/images');
const {generateFileObj} = require('./src/utils');

module.exports.fileUpload = (event) => {
  event.Records.forEach((record) => {
    const filename = record.s3.object.key;
    const filesize = record.s3.object.size;
    const fileObj = generateFileObj(filename, filesize);

    if(fileObj.ext === '.mp4'){
      video.fileUpload(fileObj);
    }else{
      image.fileUpload(fileObj);
    }

  });
};
