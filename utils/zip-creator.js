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
            try {
                archive
                    .directory(sourceDir, false)
                    .on('error', (err) => {
                        return reject({
                            error: true,
                            err,
                        });
                    })
                    .pipe(stream);

                stream.on('close', () =>
                    resolve({ error: false, message: 'Zip Created' }),
                );
                archive.finalize();
            } catch (err) {
                console.log(err);
                reject({
                    error: true,
                    err,
                });
            }
        });
    } catch (err) {
        return {
            error: true,
            err,
        };
    }
};
