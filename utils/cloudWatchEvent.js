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
    console.log('function range_time=>', range_time);
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
        ScheduleExpression: `rate(${range_time} minute${
            parseInt(range_time) === 1 ? '' : 's'
        })`,
        State: 'ENABLED',
    };

    try {
        const dataRule = await cweClient.send(new PutRuleCommand(paramsRule));
        console.log('Success, scheduled rule created; Rule ARN:', dataRule);

        const dataPermissions = await addPermissions(name);
        if (dataPermissions.error) {
            throw Error(dataPermissions.err);
        }
        console.log('Success, add permissions:', dataPermissions);
        const data = await cweClient.send(new PutTargetsCommand(paramsTarget));
        console.log('Success, target added; requestID: ', data);

        return { data, dataRule, dataPermissions }; // For unit tests.
    } catch (err) {
        console.log('line47,', err);
        return err;
    }
};
