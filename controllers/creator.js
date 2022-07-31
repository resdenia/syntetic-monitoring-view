const uploadFileOnS3 = require('../utils/upload-to-bucket');
const fileToZip = require('../utils/zip-creator');
const createLambda = require('../utils/lambda-creator');

exports.creator = async (req, res, next) => {
    const { name, description, code } = req.body;
    console.log(req.body);
    fileToZip();
};
