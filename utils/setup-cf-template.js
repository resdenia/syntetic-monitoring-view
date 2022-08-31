const fs = require('fs');
const path = require('path');
const { logger } = require('./logger');
const dirOutput = '../output';

exports.setupCFTemplate = async (code) => {
    try {
        let doc = fs.readFileSync(
            path.join(
                __dirname,
                '..',
                'service',
                'cloudFormation',
                'sam-template.yml',
            ),
            'utf8',
        );

        if (!fs.existsSync(dirOutput)) {
            fs.mkdirSync(dirOutput);
        }

        fs.writeFile('../output/sam-template.yml', doc, (err) => {
            if (err) {
                console.log(err);
            }
        });
    } catch (err) {
        logger(err);
        return {
            error: true,
            err,
        };
    }
};
