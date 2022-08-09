require('dotenv').config();
const fs = require('fs');
const path = require('path');

const playwright = require('playwright-aws-lambda');
const { PlaywrightHar } = require('playwright-har');


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
      harData = await playwrightHar.stop('./public/output/local.har');
} catch (error) {
throw error;
} finally {
if (browser) {
	await browser.close();
}
}

return true;
};
handler();
