const fs = require('fs');
const path = require('path');
const { INDEX_SPLIT } = require('./constants');

function readWriteAsync(code, filePath) {
    try {
        fs.readFile(filePath, 'utf-8', function (err, data) {
            if (err) throw err;
            const fileStarts = data.split('\n').splice(0, INDEX_SPLIT);

            const fileEnds = data
                .split('\n')
                .splice(INDEX_SPLIT, data.split('\n').length - 1);

            const newValue = fileStarts.concat(code.split('\n'));
            const resultToWrite = newValue.concat(fileEnds).join('\n');

            fs.writeFile(filePath, resultToWrite, 'utf-8', function (err) {
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
}

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
        return fileStatus;
    } catch (err) {
        console.log(err);
        statusError.error = true;
        statusError.message = err;
    }
    return statusError;
};
