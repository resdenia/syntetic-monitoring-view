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

        return new Promise((resolve, reject) => {
            s3bucket.upload(params, function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve('done uploaded');
                }
            });
        });
    } catch (err) {
        console.log(err);
    }
};
