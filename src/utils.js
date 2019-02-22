const generateFileObj = (fileName, fileSize, bucket) => {
	let splitName = fileName.split(/[.,\/ ]/); // eslint-disable-line
	return {
		path: splitName[0] + '/',
		name: splitName[1],
		ext: '.' + splitName[2].toLowerCase(),
		fullName: fileName,
		size: fileSize,
		bucket: bucket
	};
};

module.exports = {
	generateFileObj
};
