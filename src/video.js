'use strict';
//Include npm modules
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var child_process = require('child_process');
var async = require('async');
const {getUrl} = require('./awsS3');
const fs = require('fs');
const {updateThumbInDb} = require("./database");
//Set up Height and Width of the Thumbnail
let MAX_HEIGHT = 250;
let MAX_WIDTH = 250;

module.exports.thumbnailer = (file, callback) => {
  //Temporary file write stream
  var tmpFile = fs.createWriteStream('/tmp/screenshot.jpg');
  //Temporary file key
  var target = getUrl(file)
  //Async waterfall for ffmpeg process
  async.waterfall(
    [
      function generateThumbnail(next) {
        var ffmpeg = child_process.spawn('ffmpeg', [
          '-ss',
          '00:00:05', // time to take screenshot
          '-i',
          target, // url to stream from
          '-vf',
          'thumbnail,scale=' + MAX_WIDTH + ':' + MAX_HEIGHT,
          '-qscale:v',
          '2',
          '-frames:v',
          '1',
          '-f',
          'image2',
          '-c:v',
          'mjpeg',
          'pipe:1'
        ]);
        ffmpeg.on('error', function(err) {
          console.log(err);
        });
        ffmpeg.on('close', function(code) {
          if (code != 0) {
            console.log('child process exited with code ' + code);
          } else {
            console.log('Processing finished !');
          }
          tmpFile.end();
          next(code);
        });
        tmpFile.on('error', function(err) {
          console.log('stream err: ', err);
        });
        ffmpeg.on('end', function() {
          tmpFile.end();
        });
        ffmpeg.stdout.pipe(tmpFile).on('error', function(err) {
          console.log('error while writing: ', err);
        });
      },
      function upload(next) {
        var tmpFile = fs.createReadStream('/tmp/screenshot.jpg');
        child_process.exec('echo `ls -l -R /tmp`', function(error, stdout, stderr) {
        //   console.log('stdout: ' + stdout); // for checking on the screenshot
        });
        var newKey = `thumbs/${file.name}.jpg`;
        var params = {
            Bucket: file.bucket, 
            Key: newKey,
            Body: tmpFile,
            ContentType: 'image/jpeg'
        };
        var uploadMe = s3.upload(params);
        uploadMe.send(function (err, data) {
            if (err != null){
                console.log("error: " + err);
                next(err);
            }
            console.log('success');
            // console.log(data.Location);
            // Add it to MySql
            // updateThumbInDb(file, data.Location);
        });
      }
    ],
    function(err) {
      if (err) {
        console.error(
          'Unable to generate thumbnail from the bucket: ' +
            err
        );
      } else {
        console.log(
          'Successfully generated thumbnail ' 
        );
      }
    }
  );
  callback(null);
};
