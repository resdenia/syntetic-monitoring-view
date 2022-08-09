const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const { uploadFileOnS3 } = require('../utils/upload-to-bucket');
const { fileToZip } = require('../utils/zip-creator');
const { updateFile } = require('../utils/update-function');
const { updateFileLocal } = require('../utils/update-function-local');
const { createLambda } = require('../utils/lambda-creator');
const { cloudWatchEvent } = require('../utils/cloudWatchEvent');
const { NAME_OF_ZIP_FILE } = require('../utils/constants');

exports.modifyFile = async (req, res, next) => {
    const { code } = req.body;

    try {
        const data = await updateFile(code);
        if (data.error) {
            throw Error(data.err);
        }
        res.statusCode = 201;
        res.send({ error: false, message: 'File modified' });
    } catch (err) {
        res.status(400).send({ error: true, errorData: err.toString() });
    }
};

exports.createZip = async (req, res, next) => {
    try {
        const resp = await fileToZip()
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return err;
            });

        if (resp.error) {
            throw Error(resp.err);
        }
        res.statusCode = 201;
        res.send({ error: false, message: 'Zip Created' });
    } catch (err) {
        res.status(400).send({ error: true, errorData: err.toString() });
    }
};

exports.uploadZipToS3 = async (req, res, next) => {
    //
    const { access_key, secret_key, bucket_name } = req.body;
    const fileRoute = path.join(__dirname, '..', NAME_OF_ZIP_FILE);

    try {
        const readData = fs.readFileSync(fileRoute);
        let result;
        if (readData) {
            result = await uploadFileOnS3(
                NAME_OF_ZIP_FILE,
                readData,
                access_key,
                secret_key,
                bucket_name,
            );
        } else {
            throw Error('Failed to upload data');
        }
        if (result.error) {
            throw Error(result.err);
        }
        res.statusCode = 201;
        res.send({ error: false, message: 'Upload zip to S3 Bucket' });
    } catch (err) {
        res.status(400).send({ error: true, errorData: err });
    }
};

exports.createLambda = async (req, res, next) => {
    // process.env.IAM_ROLE_ARN
    // process.env.TOKEN
    // process.env.BUCKET_NAME
    // process.env.ACCESS_KEY,
    // process.env.SECRET_KEY,
    // REGION

    const { name, description } = req.body;

    try {
        const lambdaResp = await createLambda(name, description);
        if (lambdaResp.error) {
            throw Error(lambdaResp.err);
        }
        res.statusCode = 200;
        res.send({ error: false, message: 'Lambda was created' });
    } catch (err) {
        console.log(err);
        res.status(400).send({ error: true, errorData: err });
    }
};

exports.addEventBridge = async (req, res, next) => {
    const { name, range_time } = req.body;

    try {
        const resp = await cloudWatchEvent(name, range_time);

        if (resp) {
            res.statusCode = 200;
            res.send({ error: false, message: 'Lambda was created' });
        }
    } catch (err) {
        console.log(err);
        res.status(400).send({ error: true, err });
    }
};

exports.modifyFileLocally = async (req, res, next) => {
    const { code } = req.body;

    try {
        const resp = await updateFileLocal(code);
        if (resp) {
            res.statusCode = 200;
            shell.exec('node ./service/lambdaFunctionLocal/index.js');

            res.send({ error: false, message: 'File was created' });
        }
    } catch (err) {
        console.log(err);
        res.status(400).send({ error: true, err });
    }
};
