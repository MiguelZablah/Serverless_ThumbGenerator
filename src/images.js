'use strict';
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var generateThumb = (file) => {
    s3.getObject({
        Bucket: file.bucket,
        Key: file.fullName
    }, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(err);
        } else {
            console.log("Data: " + data);
            console.log("Raw text:\n" + data.Body.toString('ascii'));
            callback(null, null);
        }
    });
}

module.exports = {
    generateThumb
}
