// Load the Lambda client.
const { CreateFunctionCommand } = require('@aws-sdk/client-lambda');
const { lambdaClient } = require('./lambda-client');
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
        Role: 'IAM_ROLE_ARN', // IAM_ROLE_ARN; e.g., arn:aws:iam::650138640062:role/v3-lambda-tutorial-lambda-role
        Runtime: 'nodejs12.x',
        Description: description,
    };
    try {
        const data = await lambdaClient.send(new CreateFunctionCommand(params));
        console.log('Success', data); // successful response
    } catch (err) {
        console.log('Error', err); // an error occurred
    }
};
