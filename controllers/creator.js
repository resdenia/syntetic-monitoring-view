const fs = require('fs');
const path = require('path');
const { uploadFileOnS3 } = require('../utils/upload-to-bucket');
const { fileToZip } = require('../utils/zip-creator');
const { createLambda } = require('../utils/lambda-creator');
const { NAME_OF_ZIP_FILE } = require('../utils/constants');
exports.creator = async (req, res, next) => {
    const { name, description, code } = req.body;
    try {
        const response = await fileToZip();
        const fileRoute = path.join(
            __dirname,
            '..',
            'output',
            NAME_OF_ZIP_FILE,
        );
        createLambda(name, description);
        const readData = fs.readFileSync(fileRoute, 'utf8');
        if (readData) {
            console.log('here');
            uploadData = uploadFileOnS3(NAME_OF_ZIP_FILE, readData);
        }
        res.status(200).send('Successful!');
    } catch (err) {
        console.log(err);
    }
};
