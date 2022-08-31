const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { getAccountId } = require('./getAccountId');
const { logger } = require('./logger');

const isRoleExists = async (iam, roleName) => {
    const paramsGetRole = {
        RoleName: roleName,
    };
    const result = new Promise((resolve, reject) => {
        iam.getRole(paramsGetRole, function (err, data) {
            if (err) reject({ error: true, err }); // an error occurred
            else resolve(data); // successful response
        });
    });

    return result;
};

const createRole = async (iam, roleName, pathToRole) => {
    const policy = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, '..', 'helper', 'roles', pathToRole),
            'utf8',
        ),
    );
    const params = {
        AssumeRolePolicyDocument: JSON.stringify(policy),
        Path: '/',
        RoleName: roleName,
    };

    return new Promise((resolve, reject) => {
        iam.createRole(params, function (err, data) {
            if (err) {
                console.log(err);
                reject(err); // an error occurred
            } else resolve(data); // successful response
        });
    });
};

const setPolicy = async (iam, roleName, policyArn) => {
    const paramsPolicy = {
        PolicyArn: policyArn,
        RoleName: roleName,
    };
    return new Promise((resolve, reject) => {
        iam.attachRolePolicy(paramsPolicy, function (err, data) {
            if (err) reject(err); // an error occurred
            else resolve(data); // successful response
        });
    });
};

const createPolicy = async (iam, roleName, pathToPolicy) => {
    const policy = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, '..', 'helper', 'roles', pathToPolicy),
            'utf8',
        ),
    );
    const params = {
        PolicyDocument: policy /* required */,
        PolicyName: `${roleName}-policy` /* required */,
    };

    return new Promise((resolve, reject) => {
        iam.createPolicy(params, function (err, data) {
            if (err) reject(err); // an error occurred
            else resolve(data); // successful response
        });
    });
};

exports.AIMRole = async (
    accessKey,
    secretKey,
    roleName,
    pathToRole,
    policyArn,
) => {
    AWS.config.update({
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
    });
    const iam = new AWS.IAM();
    try {
        const getIfRoleExists = await isRoleExists(iam, roleName);
        if (getIfRoleExists.Role) {
            return { arn: getIfRoleExists.Role.Arn };
        }
    } catch (err) {
        console.log("Role Doesn't exist process to create");
    }

    try {
        const role = await createRole(iam, roleName, pathToRole);

        if (role.err) {
            throw err;
        }

        const setPolicyStatus = await setPolicy(iam, roleName, policyArn);

        if (setPolicyStatus.err) {
            throw err;
        }

        return { arn: role.Role.Arn };
    } catch (err) {
        return err;
    }
};
