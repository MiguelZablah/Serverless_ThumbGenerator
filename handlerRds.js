'use strict';
var AWS = require('aws-sdk');
const db = require('./src/database')
const {generateFileObj} = require('./src/utils');

module.exports.saveToMySql = (event, context, callback) => {
  event.Records.forEach((record) => {
    const fileObj = generateFileObj(
      record.s3.object.key, 
      record.s3.object.size,
      record.s3.bucket.name
    );
    db.updateThumbInDb(fileObj, callback);
  });
};
