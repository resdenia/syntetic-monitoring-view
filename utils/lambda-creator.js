// Load the Lambda client.
const { CreateFunctionCommand } = require('@aws-sdk/client-lambda');
const { lambdaClient } = require('./lambda-client');

// Set the parameters.

exports.createLambda = async () => {
    const params = {
        Code: {
            S3Bucket: 'BUCKET_NAME', // BUCKET_NAME
            S3Key: 'ZIP_FILE_NAME', // ZIP_FILE_NAME
        },
        FunctionName: 'FUNCTION_NAME',
        Handler: 'index.handler',
        Role: 'IAM_ROLE_ARN', // IAM_ROLE_ARN; e.g., arn:aws:iam::650138640062:role/v3-lambda-tutorial-lambda-role
        Runtime: 'nodejs12.x',
        Description: 'Creates an Amazon DynamoDB table.',
    };
    try {
        const data = await lambdaClient.send(new CreateFunctionCommand(params));
        console.log('Success', data); // successful response
    } catch (err) {
        console.log('Error', err); // an error occurred
    }
};
