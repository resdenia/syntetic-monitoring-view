const fs = require('fs');
const path = require('path');
const { uploadFileOnS3 } = require('../utils/upload-to-bucket');
const { fileToZip } = require('../utils/zip-creator');
const { createLambda } = require('../utils/lambda-creator');
const { NAME_OF_ZIP_FILE } = require('../utils/constants');
exports.creator = async (req, res, next) => {
    const { name, description, code } = req.body;
    try {
        const fileRoute = path.join(
            __dirname,
            '..',
            'output',
            NAME_OF_ZIP_FILE,
        );
        fileToZip()
            .then((result) => {
                let uploadData = true;
                const readData = fs.readFileSync(fileRoute, 'utf8');
                if (readData) {
                    console.log('here');
                    uploadData = uploadFileOnS3(NAME_OF_ZIP_FILE, readData);
                }
                return uploadData;
            })
            .then((res) => {
                return createLambda(name, description);
            })
            .catch((err) => {
                console.log(err);
            });
        res.status(200).send('Successful!');
    } catch (err) {
        console.log(err);
    }
};
