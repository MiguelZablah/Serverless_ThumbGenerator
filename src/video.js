'use strict';

module.exports.fileUpload = (event) => {
  event.Records.forEach((record) => {
    const filename = record.s3.object.key;
    const filesize = record.s3.object.size;
    console.log(`New .mp4 file has been created: ${filename} (${filesize} bytes)`);
    console.log(record);
  });
  return "File Upload";
};