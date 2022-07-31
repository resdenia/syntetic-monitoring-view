// const EasyZip = require('easy-zip').EasyZip;
// const zip = require('express-easy-zip');
const fs = require('fs');
const shell = require('shelljs');
const archiver = require('archiver');
const path = require('path');
// create a file to stream archive data to.
const output = fs.createWriteStream(__dirname + '/example.zip');
const outPath = path.join(__dirname, '..', 'output', 'lambdaFunction.zip');
const sourceDir = path.join(__dirname, '..', 'service', 'lambdaFunction');

// const sourceDir = __dirname + '/service/lambdaFunction';

exports.fileToZip = async () => {
    try {
        const archive = archiver('zip', { zlib: { level: 9 } });
        const stream = fs.createWriteStream(outPath);
        console.log('here');
        return new Promise((resolve, reject) => {
            archive
                .directory(sourceDir, false)
                .on('error', (err) => reject(err))
                .pipe(stream);

            stream.on('close', () => resolve('done'));
            archive.finalize();
        });
    } catch (err) {
        console.log(err);
        return {
            status: false,
            message: 'ZipNotCreated',
        };
    }
};
