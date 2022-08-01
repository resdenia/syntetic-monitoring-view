const { uploadFileOnS3 } = require('../utils/upload-to-bucket');
const { fileToZip } = require('../utils/zip-creator');
const { createLambda } = require('../utils/lambda-creator');

exports.creator = async (req, res, next) => {
    const { name, description, code } = req.body;
    console.log(req.body);
    try {
        const response = await fileToZip();
        console.log(response);
        res.status(200).send('data');
    } catch (err) {
        console.log(err);
    }
};
