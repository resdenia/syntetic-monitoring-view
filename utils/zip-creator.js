const fs = require('fs');
const shell = require('shelljs');
const archiver = require('archiver');
const path = require('path');
const { NAME_OF_ZIP_FILE } = require('./constants');
// create a file to stream archive data to.
const outPath = path.join(__dirname, '..', NAME_OF_ZIP_FILE);
const sourceDir = path.join(__dirname, '..', 'service', 'lambdaFunction');

// const sourceDir = __dirname + '/service/lambdaFunction';

exports.fileToZip = async () => {
    try {
        const archive = archiver('zip', { zlib: { level: 9 } });
        const stream = fs.createWriteStream(outPath);
        return new Promise((resolve, reject) => {
            archive
                .directory(sourceDir, false)
                .on('error', (err) => reject(err))
                .pipe(stream);

            stream.on('close', () => console.log('done1'));
            archive.finalize();
            console.log('done2');
            archive.on('end', function () {
                resolve('done3');
                // console.log('Archive wrote %d bytes', archive.pointer());
            });
            // resolve('done1');
        });
    } catch (err) {
        console.log(err);
        return {
            status: false,
            message: 'ZipNotCreated',
        };
    }
};
