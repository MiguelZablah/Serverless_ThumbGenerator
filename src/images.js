'use strict';
const Jimp = require('jimp');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

// Creates a pre-sign url for img
var getUrl = (file) => {
    var timeToExpire = 300; // 5 Minuts
    var params = {Bucket: file.bucket, Key: file.fullName, Expires: timeToExpire};
    var url = s3.getSignedUrl('getObject', params);
    return url;
}

// Save File to s3
var putS3 = (file, imgBase64) => {
    var buf = new Buffer(imgBase64.replace(/^data:image\/\w+;base64,/, ""),'base64');
    var newKey = `thumbs/${file.name}.jpg`;
    var params = {
        Bucket: file.bucket, 
        Key: newKey,
        Body: buf,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
    };
    s3.upload(params, function (err, data) {
        if (err) {
            console.log('error in callback');
            console.log(err);
            return false;
        }
        console.log('success');
        // console.log(data);
        return true;
    });
};

var getImg64 = (file) => {
    var imgUrl = getUrl(file);
    // console.log(imgUrl);
    return new Promise((res, rej) => {
        Jimp.read(imgUrl, (err, image) => {
            if(err){
                rej(err);
            }
            image.quality(60)
            .resize(250, 250, Jimp.RESIZE_BEZIER)
            .getBase64("image/jpeg", (err, imgBase64) => {
                if(err){
                    return rej("Img not convertert to base64", err);
                }
                res(imgBase64);
            });
        }).catch(function (err) {
            return rej('No thumb generated!');
        });
    });
}

var generateThumb = (file) => {
    getImg64(file).then((img) => {
        if(putS3(file, img)){
            return;
        }
        return;
    }).catch((err) => {
        console.log("Error: ", err);
        return;
    });
};

module.exports = {
    generateThumb
};
