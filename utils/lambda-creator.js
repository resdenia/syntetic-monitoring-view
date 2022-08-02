// Load the Lambda client.
const { CreateFunctionCommand } = require('@aws-sdk/client-lambda');
const { InvokeCommand } = require('@aws-sdk/client-lambda');
const { LambdaClient } = require('@aws-sdk/client-lambda');
const AWS = require('aws-sdk');

// const { lambdaClient } = require('./lambda-client');
const { NAME_OF_ZIP_FILE, LAMBDA_FUNCTION_NAME } = require('./constants');

// Set the parameters.

exports.createLambda = async (functionName, description) => {
    const params = {
        Code: {
            S3Bucket: process.env.BUCKET_NAME, // BUCKET_NAME
            S3Key: 'Archive.zip', // ZIP_FILE_NAME
        },
        FunctionName: functionName || LAMBDA_FUNCTION_NAME,
        Handler: 'lambdaFunction.index.handler',
        Role: 'arn:aws:iam::365780514238:role/service-role/lambda-basic', // IAM_ROLE_ARN; e.g., arn:aws:iam::650138640062:role/v3-lambda-tutorial-lambda-role
        Runtime: 'nodejs16.x',
        Description: description,
        MemorySize: 512,
        Environment: {
            Variables: {
                TOKEN: process.env.TOKEN,
            },
        },
    };
    try {
        // const lambda = new LambdaClient({ region: process.env.REGION });
        AWS.config.update({
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_KEY,
        });
        const lambda = new AWS.Lambda({
            region: process.env.REGION,
        });

        return new Promise((resolve, reject) => {
            lambda.createFunction(params, function (err, data) {
                if (err) reject(err); // an error occurred
                else resolve(data); // successful response
            });
        });
    } catch (err) {
        console.log('Error', err); // an error occurred
    }
};
