process.env.PATH = process.env.PATH + ':/tmp/'
process.env['FFMPEG_PATH'] = '/tmp/ffmpeg';
const BIN_PATH = process.env['LAMBDA_TASK_ROOT'] 
process.env['PATH'] = process.env['PATH'] + ':' + BIN_PATH;
'use strict';
//Set up ffmpeg binary path at LAMBDA_TASK_ROOT
const video = require('./src/video');
const image = require('./src/images');
const {generateFileObj} = require('./src/utils');

module.exports.fileUpload = (event, context, callback) => {
  event.Records.forEach((record) => {
    const fileObj = generateFileObj(
      record.s3.object.key, 
      record.s3.object.size,
      record.s3.bucket.name
    );
    if(fileObj.ext === '.mp4'){
      require('child_process').exec('cp /var/task/ffmpeg /tmp/.; chmod 755 /tmp/ffmpeg;', function (error, stdout, stderr) {
        if (error) {
          console.log('Erro occured',error);
        } else {
            video.thumbnailer(fileObj, callback);
        }
      });
    }else if(fileObj.ext === '.png' || fileObj.ext === '.jpg' || fileObj.ext === '.gif'){
      image.generateThumb(fileObj);
    }else{
      console.log("File not extension not supporte: " + fileObj.fullName)
    }
  });
};
