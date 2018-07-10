var AWS = require('aws-sdk');
var s3 = new AWS.S3();
const {updateThumbInDb} = require("./database");

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
        console.log(data.Location);
        // Add it to MySql
        // updateThumbInDb(file, data.Location);
        return true;
    });
};

module.exports = {
    getUrl,
    putS3
};
