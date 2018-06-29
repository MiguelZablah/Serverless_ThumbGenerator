
var generateFileObj = (fileName, fileSize) => {
    var splitName = fileName.split(/[.,\/ ]/);
    return {
        path: splitName[0] + '/',
        name: splitName[1],
        ext: '.'+splitName[2].toLowerCase(),
        size: fileSize
    };
}

module.exports = {
    generateFileObj
}
