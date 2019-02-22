let expect = require('expect');
let { updateThumbInDb } = require('../database');

describe('UpdateLocalDb', () => {
	it('Should update db table colum ThumbsUrl', () => {
		let file = {
			path: 'uploads/',
			name: 'f63aa3a8-001d-4349-8461-4881518a2b64',
			ext: '.jpg',
			fullName: 'thumbs/f63aa3a8-001d-4349-8461-4881518a2b64.jpg',
			size: 12345,
			bucket: 'bucket'
		};
		let thumbUrl =
			'https://cm-files-thumbs.s3.amazonaws.com/thumbs/f63aa3a8-001d-4349-8461-4881518a2b64.jpg';

		let res = updateThumbInDb(file, thumbUrl);

		expect(res).toBeTruthy();
	});
});
