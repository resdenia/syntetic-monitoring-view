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
                let uploadData = true;
                const readData = fs.readFileSync(fileRoute, 'utf8');
                if (readData) {
                    uploadData = uploadFileOnS3(NAME_OF_ZIP_FILE, readData);
                }
                return uploadData;
            })
            .then((res) => {
                console.log(res);
                console.log('status');
                const uplaoded = createLambda(name, description);
                return uplaoded;
            })
            .catch((err) => {
                console.log(err);
            });
        res.statusCode = 200;
        res.send({ message: 'sucessfull', resp, data });
    } catch (err) {
        console.log(err);
        res.status(404).send(err);
    }
};
