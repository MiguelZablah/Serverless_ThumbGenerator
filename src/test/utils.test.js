const expect = require('expect');
const { generateFileObj } = require('../utils');

describe('generateFileObj', () => {
	it('Should generate give a format file obj', () => {
		let filename = 'uploads/example-v1.png';
		let fileSize = 12345;
		let bucketName = 'bucket';

		let expectedFileObj = {
			path: 'uploads/',
			name: 'example-v1',
			ext: '.png',
			fullName: filename,
			size: fileSize,
			bucket: bucketName
		};

		let fileObj = generateFileObj(filename, fileSize, bucketName);

		expect(fileObj).toMatchObject(expectedFileObj);
	});
});
