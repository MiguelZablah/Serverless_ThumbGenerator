var expect = require('expect');
var {generateFileObj} = require('./utils');

describe('generateFileObj', () => {
    
    it('Should generate give a format file obj', () => {
        var filename = 'uploads/example-v1.png';
        var fileSize = 12345;
        var bucketName = 'bucket';

        var expectedFileObj = {
            path: 'uploads/',
            name: 'example-v1',
            ext: '.png',
            fullName: filename,
            size: fileSize,
            bucket: bucketName
        };

        var fileObj = generateFileObj(filename, fileSize);

        expect(fileObj).toMatchObject(expectedFileObj);
    });

});