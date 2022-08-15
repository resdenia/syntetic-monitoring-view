module.exports = {
    startFile: `require('dotenv').config();
	const fs = require('fs');
	const path = require('path');
	const  convertHarToJSON  = require('./convertHarToJSON');

	const playwright = require('playwright-aws-lambda');
	const { PlaywrightHar } = require('playwright-har');
	const parseHarFile = require('./parseHar');
	const logger = require('logzio-nodejs').createLogger({
		token: process.env.TOKEN,
		protocol: 'https',
		host: 'listener.logz.io',
		port: '8071',
		type: 'syntetic-scripting', // OPTIONAL (If none is set, it will be 'nodejs')
		sendIntervalMs: 1000,
	});
	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
	exports.handler = async (event, context) => {
		let browser = null;
		let harData = null;
		try {
			browser = await playwright.launchChromium();
			const context = await browser.newContext();
	
			const page = await context.newPage();
			const playwrightHar = new PlaywrightHar(page);
			await playwrightHar.start();
	`,
    endFile: `      harData = await playwrightHar.stop();
} catch (error) {
	throw error;
} finally {
	if (browser) {
		await browser.close();
	}
}
try {
	// const parsedData = parseHarFile(harData);

	// parsedData.probes[0].requests.forEach((log) => {
	//     logger.log({ message: log });
	// });
	const parsedData = convertHarToJSON(harData);
		logger.log(parsedData);

} catch (err) {
	console.log(err);
}
logger.sendAndClose();
await sleep(4000);

return true;
};
`,
    startFileLocally: `require('dotenv').config();
const fs = require('fs');
const path = require('path');
const convertHarToJSON = require('./convertHarToJSON');
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
`,
    endFileLocally: `      harData = await playwrightHar.stop('./public/output/local.har');
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
`,
};
