const uploadFileOnS3 = require('../utils/upload-to-bucket');
const fileToZip = require('../utils/zip-creator');
const createLambda = require('../utils/lambda-creator');

exports.creatorController = async (req, res, next) => {
    const { name, description, code } = req.body;
};
