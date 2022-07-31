// index.js

// TODO: Add custom code from the user
// TODO: Install an app(probably we can upload it already)
// TODO: Upload to S3 bucket
// TODO: Create AWS Lambda Function(take name of the function)
// TODO: Attach to lambda function CloudWatch Events

const express = require('express');
const bodyParser = require('body-parser');
const shell = require('shelljs');
const path = require('path');

const mainRoutes = require('./routes/main');
const creatorRoutes = require('./routes/creator');

const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.post('/exec', async (req, res) => {
    try {
    } catch (err) {
        console.error(`error in cloud run handler: ${err}`);
        res.status(200).send();
    }
});

app.use(mainRoutes);
app.use(creatorRoutes);
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`helloworld: listening on port ${port}`);
});
