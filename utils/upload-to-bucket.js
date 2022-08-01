const AWS = require('aws-sdk');

exports.uploadFileOnS3 = async (fileName, fileData) => {
    try {
        const statusError = {
            status: false,
            error: '',
            message: '',
        };
        AWS.config.update({
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_KEY,
        });
        const s3bucket = new AWS.S3();
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileName,
            Body: fileData,
        };

        s3bucket.upload(params, function (err, res) {
            console.log('here');
            console.log(params);
            if (err) {
                console.log(err);
                statusError.status = true;
                statusError.error = err;
                statusError.message = 'Failed to upload to s3 Bucket';
            } else {
                console.log('File successfully uploaded.');
            }
        });
    } catch (err) {
        console.log(err);
    }
};
