const AWS = require('aws-sdk');

exports.uploadFileOnS3 = (fileName, fileData) => {
    const statusError = {
        status: false,
        error: '',
        message: '',
    };
    AWS.config.update({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
    });
    const s3bucket = new AWS.S3({
        params: { Bucket: process.env.BUCKET_NAME },
    });
    const params = {
        Key: fileName,
        Body: fileData,
    };
    s3bucket.upload(params, function (err, res) {
        if (err) {
            statusError.status = true;
            statusError.error = err;
            statusError.message = 'Failed to upload to s3 Bucket';
        } else {
            console.log('File successfully uploaded.');
        }
    });
    return statusError;
};
