const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// Creates a pre-sign url for img
const getUrl = (file, timeToExpire = 300) => {
	let params = { Bucket: file.bucket, Key: file.fullName, Expires: timeToExpire };
	let url = s3.getSignedUrl('getObject', params);
	return url;
};

// Save File to s3
const putS3 = (file, imgBase64) => {
	let buf = new Buffer(imgBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
	let newKey = `thumbs/${file.name}.jpg`;
	let params = {
		Bucket: file.bucket,
		Key: newKey,
		Body: buf,
		ContentEncoding: 'base64',
		ContentType: 'image/jpeg'
	};

	s3.upload(params, function(err, data) {
		if (err) {
			console.log('error in callback'); // eslint-disable-line
			console.log(err); // eslint-disable-line
			return false;
		}
		console.log('success'); // eslint-disable-line
		console.log(data.Location); // eslint-disable-line
		return true;
	});
};

module.exports = {
	getUrl,
	putS3
};
