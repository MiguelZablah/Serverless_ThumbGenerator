'use strict';
const AWS = require('aws-sdk');
const child_process = require('child_process');
const async = require('async');
const { getUrl } = require('./awsS3');
const s3 = new AWS.S3();
const fs = require('fs');

module.exports.thumbMaker = (file, callback) => {
	//Temporary file write stream
	var tmpFile = fs.createWriteStream('/tmp/screenshot.jpg');
	//Temporary file key
	var target = getUrl(file);
	//Async waterfall for ffmpeg process
	async.waterfall(
		[
			function generateThumbnail(next) {
				var ffmpeg = child_process.spawn('ffmpeg', [
					'-i',
					target, // url to stream from
					'-r',
					'1',
					'-an',
					'-t',
					'1',
					'-ss',
					'00:00:05', // time to take screenshot
					'-s',
					'250x250',
					'-vsync',
					'1',
					'-threads',
					'4',
					'-f',
					'image2',
					'-c:v',
					'mjpeg',
					'pipe:1'
				]);
				ffmpeg.on('error', err => {
					console.log(err); // eslint-disable-line
				});
				ffmpeg.on('close', code => {
					if (code != 0) {
						console.log('child process exited with code ' + code); // eslint-disable-line
					} else {
						console.log('Processing finished !'); // eslint-disable-line
					}
					tmpFile.end();
					next(code);
				});
				tmpFile.on('error', err => {
					console.log('stream err: ', err); // eslint-disable-line
				});
				ffmpeg.on('end', () => {
					tmpFile.end();
				});
				ffmpeg.stdout.pipe(tmpFile).on('error', err => {
					console.log('error while writing: ', err); // eslint-disable-line
				});
			},
			function upload(next) {
				let tmpFile = fs.createReadStream('/tmp/screenshot.jpg');
				child_process.exec('echo `ls -l -R /tmp`', (error, stdout, stderr) => { // eslint-disable-line
					//   console.log('stdout: ' + stdout); // for checking on the screenshot
				});
				let newKey = `thumbs/${file.name}.jpg`;
				let params = {
					Bucket: file.bucket,
					Key: newKey,
					Body: tmpFile,
					ContentType: 'image/jpeg'
				};
				let uploadMe = s3.upload(params);
				uploadMe.send((err, data) => {
					if (err != null) {
						console.log('error: ' + err); // eslint-disable-line
						next(err);
					}
					console.log('success'); // eslint-disable-line
					console.log(data.Location); // eslint-disable-line
				});
			}
		],
		function(err) {
			if (err) {
				console.error('Unable to generate thumbnail for video, error code: ' + err); // eslint-disable-line
			} else {
				console.log('Successfully generated thumbnail '); // eslint-disable-line
			}
		}
	);
	callback(null);
};
