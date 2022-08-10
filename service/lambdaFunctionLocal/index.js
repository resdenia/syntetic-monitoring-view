require('dotenv').config();
const fs = require('fs');
const path = require('path');
const convertHarToJSON = require('./convertHarToJSON');

const playwright = require('playwright-aws-lambda');
const { PlaywrightHar } = require('playwright-har');
console.log(process.env.TOKEN);
const token = process.env.TOKEN;
const logger = require('logzio-nodejs').createLogger({
    token: token,
    protocol: 'https',
    host: 'listener.logz.io',
    port: '8071',
    debug: true,
    bufferSize: 50,
    type: 'syntetic-scripting', // OPTIONAL (If none is set, it will be 'nodejs')
    sendIntervalMs: 1000,
});
const handler = async (event, context) => {
    let browser = null;
    let harData = null;
    try {
        browser = await playwright.launchChromium();
        const context = await browser.newContext();

        const page = await context.newPage();
        const playwrightHar = new PlaywrightHar(page);
        await playwrightHar.start();

        await page.goto('https://logz.io/');

        await page.setViewportSize({ width: 1850, height: 877 });

        await page.waitForSelector(
            '.home > .body_wrapper > .cta_bottom_section',
        );
        await page.click('.home > .body_wrapper > .cta_bottom_section');

        await page.waitForSelector(
            '.navigation-body > .navigation-body-section_ > .navigation-menu > .navigation-item:nth-child(2) > .navigation-link',
        );
        await page.click(
            '.navigation-body > .navigation-body-section_ > .navigation-menu > .navigation-item:nth-child(2) > .navigation-link',
        );
        harData = await playwrightHar.stop();
    } catch (error) {
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
    const parsedData = convertHarToJSON(harData);
    console.log(parsedData.result.length);

    // console.log(parsedData.flatEntries[1]);

    parsedData.result.forEach((log) => {
        // console.log(log);
        logger.log(log);
    });

    return true;
};
handler();
