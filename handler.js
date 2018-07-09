'use strict';
const video = require('./src/video');
const image = require('./src/images');
const {generateFileObj} = require('./src/utils');

module.exports.fileUpload = (event) => {
  event.Records.forEach((record) => {
    const fileObj = generateFileObj(
      record.s3.object.key, 
      record.s3.object.size,
      record.s3.bucket.name
    );
    if(fileObj.ext === '.mp4'){
      video.fileUpload(fileObj);
    }else if(fileObj.ext === '.png' || fileObj.ext === '.jpg' || fileObj.ext === '.gif'){
      image.generateThumb(fileObj);
    }else{
      console.log("File not extension not supporte: " + fileObj.fullName)
    }
  });
};
