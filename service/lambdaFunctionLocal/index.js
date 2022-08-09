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
