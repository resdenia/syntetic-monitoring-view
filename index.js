// index.js

const express = require('express');
const bodyParser = require('body-parser');
const shell = require('shelljs');
const path = require('path');

const mainRoutes = require('./routes/main');
const videoRoutes = require('./routes/video');
const metricsRoutes = require('./routes/metrics');
const fs = require('fs');
const AWS = require('aws-sdk');

const storage = new Storage();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
});
var s3bucket = new AWS.S3({ params: { Bucket: process.env.BUCKET_NAME } });
function uploadFileOnS3(fileName, fileData) {
    var params = {
        Key: fileName,
        Body: fileData,
    };
    s3bucket.upload(params, function (err, res) {
        if (err) console.log('Error in uploading file on s3 due to ' + err);
        else console.log('File successfully uploaded.');
    });
}

app.post('/exec', async (req, res) => {
    try {
    } catch (err) {
        console.error(`error in cloud run handler: ${err}`);
        res.status(200).send();
    }
});

app.use(mainRoutes);
app.use(videoRoutes);
app.use('/api/send', metricsRoutes);
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`helloworld: listening on port ${port}`);
});
