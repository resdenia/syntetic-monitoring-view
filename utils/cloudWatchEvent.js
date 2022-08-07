const {
    PutRuleCommand,
    PutTargetsCommand,
} = require('@aws-sdk/client-cloudwatch-events');

const { cweClient } = require('./cloudWatchEventsClient.js');
const { CLOUDWATCH_EVENT, LAMBDA_FUNCTION_NAME } = require('./constants');

exports.cloudWatchEvent = async () => {
    const paramsTarget = {
        Rule: CLOUDWATCH_EVENT,
        Targets: [
            {
                Arn: LAMBDA_FUNCTION_NAME, //LAMBDA_FUNCTION_ARN
                Id: 'myCloudWatchEventsTarget',
            },
        ],
    };
    const paramsRule = {
        Name: CLOUDWATCH_EVENT,
        RoleArn: process.env.IAM_ROLE_ARN_EVENT, //IAM_ROLE_ARN
        ScheduleExpression: 'rate(5 minutes)',
        State: 'ENABLED',
    };
    try {
        const dataRule = await cweClient.send(new PutRuleCommand(paramsRule));
        console.log('Success, scheduled rule created; Rule ARN:', dataRule);

        const data = await cweClient.send(new PutTargetsCommand(paramsTarget));
        console.log('Success, target added; requestID: ', data);
        return { data, dataRule }; // For unit tests.
    } catch (err) {
        console.log(err);
        return err;
    }
};
