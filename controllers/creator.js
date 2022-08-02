const fs = require('fs');
const path = require('path');
const { uploadFileOnS3 } = require('../utils/upload-to-bucket');
const { fileToZip } = require('../utils/zip-creator');
const { updateFile } = require('../utils/update-function');
const { createLambda } = require('../utils/lambda-creator');
const { NAME_OF_ZIP_FILE } = require('../utils/constants');

exports.creator = async (req, res, next) => {
    const { name, description, code } = req.body;
    try {
        // const fileRoute = path.join(__dirname, '..', NAME_OF_ZIP_FILE);
        // const data = await updateFile(code)
        //     .then((status) => status)
        //     .catch((err) => console.log(err));
        // console.log(data);
        // const resp = await fileToZip()
        //     .then((result) => {
        //         console.log(result);
        //     })
        //     .then((res) => {})
        //     .then((resp) => {})
        //     .catch((err) => {
        //         console.log(err);
        //     });
        const readData = fs.readFileSync(fileRoute, 'utf8');
        let result;
        if (readData) {
            result = await uploadFileOnS3(NAME_OF_ZIP_FILE, readData);
        } else {
            throw Error('Failed to upload data');
        }
        console.log(result);
        const lambdaResp = await createLambda(name, description);
        console.log(lambdaResp);
        res.statusCode = 200;
        res.send({ message: 'sucessfull' });
    } catch (err) {
        console.log(err);
        res.status(404).send(err);
    }
};

exports.modifyFile = async (req, res, next) => {
    const { code } = req.body;

    try {
        const data = await updateFile(code)
            .then((status) => status)
            .catch((err) => console.log(err));
        console.log(data);
        res.statusCode = 201;
        res.send({ message: 'Function Lambda' });
    } catch (err) {
        console.log(err);
        res.status(404).send(err);
    }
};

exports.createZip = async (req, res, next) => {
    try {
        const resp = await fileToZip()
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            });
        res.statusCode = 201;
        res.send({ message: 'Function Lambda' });
    } catch (err) {
        console.log(err);
        res.status(404).send(err);
    }
};

exports.uploadZipToS3 = async (req, res, next) => {
    const fileRoute = path.join(__dirname, '..', NAME_OF_ZIP_FILE);

    try {
        const readData = fs.readFileSync(fileRoute, 'utf8');
        let result;
        if (readData) {
            result = await uploadFileOnS3(NAME_OF_ZIP_FILE, readData);
        } else {
            throw Error('Failed to upload data');
        }
    } catch (err) {
        console.log(err);
        res.status(404).send(err);
    }
};

exports.createLambda = async (req, res, next) => {
    try {
        const lambdaResp = await createLambda(name, description);
        console.log(lambdaResp);
        res.statusCode = 200;
        res.send({ message: 'sucessfull' });
    } catch (err) {
        console.log(err);
        res.status(404).send(err);
    }
};
