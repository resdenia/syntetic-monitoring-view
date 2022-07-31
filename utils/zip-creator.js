const EasyZip = require('easy-zip').EasyZip;
const fs = require('fs');

exports.fileToZip = () => {
    try {
        const zip = new EasyZip();
        zip.zipFolder('../service/lambdaFunction', function () {
            zip.writeToFile('lambda-function.zip');
        });
    } catch (err) {
        console.log(err);
    }
};
