const AWS = require('aws-sdk');
const { NAME_OF_ZIP_FILE, LAMBDA_FUNCTION_NAME } = require('./constants');

const TEMPLATE_BODY = `AWSTemplateFormatVersion: '2010-09-09'
Transform: 'AWS::Serverless-2016-10-31'
Description: "This is an AWS Lambda function that collects CloudWatch logs and sends them to Logz.io in bulk, over HTTP."

Resources:
  ScheduledLambda:
    Type: AWS::Serverless::Function
    Properties:
      Runtime: nodejs16.x
      CodeUri:
        Bucket: ${process.env.BUCKET_NAME}
        Key: ${NAME_OF_ZIP_FILE}
      Handler: index.handler
      Description: Run twice a day - once on a cron schedule and once on a rate schedule
      FunctionName: ${LAMBDA_FUNCTION_NAME}
      Events:
        CronEvent:
          Type: Schedule
          Properties:
            Schedule: cron(15 13 * * ? *)
            Name: CronSchedule
            Description: Trigger Lambda at 1:15 PM daily
      Environment:
        Variables:
          TOKEN: ${process.env.TOKEN}`;

exports.createCloudFormation = async (functionName, description) => {
    console.log('here');
    try {
        AWS.config.update({
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_KEY,
        });
        const cloudformation = new AWS.CloudFormation({
            region: process.env.REGION,
        });
        params = {
            StackName: 'syntetic-flow',

            Capabilities: [`CAPABILITY_AUTO_EXPAND`],

            TemplateBody: TEMPLATE_BODY,
        };

        return new Promise((resolve, reject) => {
            cloudformation.createStack(params, function (err, data) {
                if (err) reject(err); // an error occurred
                else resolve(data); // successful response
            });
        });
    } catch (err) {
        console.log(err);
    }
};
