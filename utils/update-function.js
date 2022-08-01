const fs = require('fs');
const readline = require('readline');
const path = require('path');
function readWriteAsync() {
    fs.readFile('filelist.txt', 'utf-8', function (err, data) {
        if (err) throw err;

        var newValue = data.replace(/^\./gim, 'myString');

        fs.writeFile('filelistAsync.txt', newValue, 'utf-8', function (err) {
            if (err) throw err;
            console.log('filelistAsync complete');
        });
    });
}

function readWriteSync() {
    var data = fs.readFileSync('filelist.txt', 'utf-8');

    var newValue = data.replace(/^\./gim, 'myString');

    fs.writeFileSync('filelistSync.txt', newValue, 'utf-8');

    console.log('readFileSync complete');
}

module.exports = updateFile = (code) => {
    try {
    } catch (err) {
        console.log(err);
    }
};
