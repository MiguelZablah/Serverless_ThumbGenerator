
var generateFileObj = (fileName, fileSize, bucket) => {
    var splitName = fileName.split(/[.,\/ ]/);
    return {
        path: splitName[0] + '/',
        name: splitName[1],
        ext: '.'+splitName[2].toLowerCase(),
        fullName: fileName,
        size: fileSize,
        bucket: bucket
    };
}

module.exports = {
    generateFileObj
}
