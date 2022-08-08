const {
    PutRuleCommand,
    PutTargetsCommand,
} = require('@aws-sdk/client-eventbridge');
// const AWS = require('aws-sdk');

const { cweClient } = require('./cloudWatchEventsClient.js');
const { addPermissions } = require('./addPermissions');
const { CLOUDWATCH_EVENT } = require('./constants');

exports.cloudWatchEvent = async (name, range_time) => {
    console.log('function name!!=>', name);

    const paramsTarget = {
        Rule: CLOUDWATCH_EVENT,
        Targets: [
            {
                Arn: `arn:aws:lambda:${process.env.REGION}:${process.env.ACCOUNT_ID}:function:${name}`, //LAMBDA_FUNCTION_ARN
                Id: 'myCloudWatchEventsTarget',
            },
        ],
    };
    const paramsRule = {
        Name: CLOUDWATCH_EVENT,
        RoleArn: process.env.IAM_ROLE_ARN_EVENT, //IAM_ROLE_ARN
        ScheduleExpression: `rate(${range_time} minutes)`,
        State: 'ENABLED',
    };

    try {
        const dataRule = await cweClient.send(new PutRuleCommand(paramsRule));
        console.log('Success, scheduled rule created; Rule ARN:', dataRule);

        const dataEVEnt = await addPermissions(name);
        console.log('Success, add permissions:', dataEVEnt);
        const data = await cweClient.send(new PutTargetsCommand(paramsTarget));
        console.log('Success, target added; requestID: ', data);

        return { data, dataRule, dataEVEnt }; // For unit tests.
    } catch (err) {
        console.log(err);
        return err;
    }
};
