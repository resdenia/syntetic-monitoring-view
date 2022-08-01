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
        const fileRoute = path.join(__dirname, '..', NAME_OF_ZIP_FILE);
        const data = await updateFile(code)
            .then((status) => status)
            .catch((err) => console.log(err));

        const resp = await fileToZip()
            .then((result) => {
                console.log(result);
            })
            .then((res) => {})
            .then((resp) => {})
            .catch((err) => {
                console.log(err);
            });
        const readData = fs.readFileSync(fileRoute, 'utf8');
        if (readData) {
            uploadFileOnS3(NAME_OF_ZIP_FILE, readData);
        } else {
            throw Error('Failed to upload data');
        }
        createLambda(name, description);

        res.statusCode = 200;
        res.send({ message: 'sucessfull' });
    } catch (err) {
        console.log(err);
        res.status(404).send(err);
    }
};
