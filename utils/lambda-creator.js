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
            S3Key: NAME_OF_ZIP_FILE, // ZIP_FILE_NAME
        },
        FunctionName: functionName || LAMBDA_FUNCTION_NAME,
        Handler: 'index.handler',
        Role: 'arn:aws:iam::365780514238:role/service-role/lambda-basic', // IAM_ROLE_ARN; e.g., arn:aws:iam::650138640062:role/v3-lambda-tutorial-lambda-role
        Runtime: 'nodejs12.x',
        Description: description,
        MemorySize: 512,
        Environment: {
            TOKEN: process.env.TOKEN,
        },
    };
    try {
        // const lambda = new LambdaClient({ region: process.env.REGION });
        AWS.config.update({
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_KEY,
        });
        const s3bucket = new AWS.Lambda();
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileName,
            Body: fileData,
        };
        console.log('created Lambda');
        // return await lambda.send(new CreateFunctionCommand(params));
    } catch (err) {
        console.log('Error', err); // an error occurred
    }
};
