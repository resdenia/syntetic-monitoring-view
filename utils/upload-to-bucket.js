const AWS = require('aws-sdk');

exports.uploadFileOnS3 = (fileName, fileData) => {
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
        if (err) console.log('Error in uploading file on s3 due to ' + err);
        else console.log('File successfully uploaded.');
    });
};
