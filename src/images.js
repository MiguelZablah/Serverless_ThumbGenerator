'use strict';
const Jimp = require('jimp');
const {getUrl, putS3} = require('./awsS3');

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
};

var generateThumb = (file) => {
    getImg64(file).then((img) => {
        if(putS3(file, img)){
            return true;
        }
        return;
    }).catch((err) => {
        console.log("Error: ", err);
        return false;
    });
};

module.exports = {
    generateThumb
};
