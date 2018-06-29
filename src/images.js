'use strict';

module.exports.fileUpload = (file) => {
    console.log(`New image file has been created: ${file.name}${file.ext} (${file.size} bytes)`);
};