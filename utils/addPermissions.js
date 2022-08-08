const AWS = require('aws-sdk');
const { CLOUDWATCH_EVENT } = require('./constants');

exports.addPermissions = async (name) => {
    AWS.config.update({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
    });
    const lambda = new AWS.Lambda({
        region: process.env.REGION,
    });
    return new Promise((resolve, reject) => {
        var params = {
            Action: 'lambda:InvokeFunction' /* required */,
            FunctionName: name || LAMBDA_FUNCTION_NAME /* required */,
            Principal: 'events.amazonaws.com' /* required */,
            StatementId: 'my-scheduled-event' /* required */,
            SourceArn: `arn:aws:events:${process.env.REGION}:${process.env.ACCOUNT_ID}:rule/${CLOUDWATCH_EVENT}`,
        };
        lambda.addPermission(params, function (err, data) {
            if (err) reject(err); // an error occurred
            else resolve(data); // successful response
        });
    });
};
