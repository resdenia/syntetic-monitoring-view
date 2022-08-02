const fs = require('fs');
const path = require('path');
const { startFile, endFile } = require('../helper/index-config');
const readWriteAsync = async (code, filePath) => {
    try {
        fs.readFileSync(filePath, 'utf-8', (err, data) => {
            if (err) throw err;
            const fileStarts = startFile.split('\n');

            const fileEnds = endFile.split('\n');

            const newValue = fileStarts.concat(code.split('\n'));
            const resultToWrite = newValue.concat(fileEnds).join('\n');

            fs.writeFileSync(filePath, resultToWrite, 'utf-8', function (err) {
                if (err) throw err;
                console.log('filelistAsync complete');
            });
        });
        return {
            error: false,
            message: 'FileUpdated',
        };
    } catch (err) {
        console.log(err);
        return {
            error: true,
            message: err,
        };
    }
};

exports.updateFile = async (code) => {
    const statusError = {
        error: false,
        message: '',
    };
    const filePath = path.join(
        __dirname,
        '..',
        'service',
        'lambdaFunction',
        'index.js',
    );
    // Test
    // const filePath = path.join(__dirname, '..', 'mock', 'file-write.js');
    try {
        const fileStatus = await readWriteAsync(code, filePath);
        console.log('File updated');
        return fileStatus;
    } catch (err) {
        console.log(err);
        statusError.error = true;
        statusError.message = err;
    }
    return statusError;
};
