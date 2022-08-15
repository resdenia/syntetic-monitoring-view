require('dotenv').config();
const fs = require('fs');
// const {writeFileSync, writeFile} = require('fs')
const path = require('path');
const convertHarToJSON = require('./convertHarToJSON');
const playwright = require('playwright-aws-lambda');
const { PlaywrightHar } = require('playwright-har');
const token = process.env.TOKEN || 'vfFDZjscgjhUmUmhafqXaaTKBYNCZwpL';
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
const handler = async (event) => {
    let browser = null;
    let context = null;
    let harData = null;
    try {
        browser = await playwright.launchChromium();
        // content?: "omit"|"embed"|"attach";
        context = await browser.newContext({
            recordHar: {
                path: './example.har',
                mode: 'full',
                content: 'omit',
            },
        });
		await context.storageState({path:'state.json'})
		// await context.route('**/*', async route => {
		// 	// If you use page.fetch, it'll use browser cookie jar, use new request context instead.
		// 	// Create request context with standalone cookie jar.
		// 	const requestContext = await request.newContext();
		// 	const response = await requestContext.fetch(route.request());
		// 	const responseHeaders = response.headers();
		// 	delete responseHeaders['set-cookie'];
		// 	console.log('route not yet fulfilled', (await context.cookies()).length);
		
		// 	route.fulfill({
		// 	  response,
		// 	  headers: responseHeaders,
		// 	});
		//   });
		const urls = [];
        const page = await context.newPage();
		let playwrightHar;
		page.on('load', async(data)=>{
			if(!urls.includes(data.url()))
			{
				
				urls.push(data.url()) 
			console.log('here');
			// const d = data.context();
			 playwrightHar = new PlaywrightHar(page);
			await playwrightHar.start();
			
			// // console.log(data);
			// console.log(JSON.stringify(d));
			// 	writeFileSync('text.txt',d );
			// console.log(data);
		
			}
			
		})
		page.on('close',async(data)=>{
			console.log('close');
			const url= data.url();
			const name_url= url.substring(8, url.length-1).replace('/', '');
			
			const name = `new-${name_url}.har`;
			var createStream = fs.createWriteStream(name);
	
			createStream.end();
			 await playwrightHar.stop(name);
			// console.log(harData);
		})

		// function logRequest(interceptedRequest) {
		// 	console.log('A request was made:', interceptedRequest.url());
		//   }
		  page.on('request', async(request)=>{
			console.log(request.url());
		  });
        const navPromise = page.waitForNavigation();

        await page.goto('https://logz.io/');

		
        await page.setViewportSize({ width: 1850, height: 877 });

        await page.waitForSelector(
            '.home > .body_wrapper > .cta_bottom_section',
        );
        await page.click('.home > .body_wrapper > .cta_bottom_section');

        await page.waitForSelector(
            '.navigation-body > .navigation-body-section_ > .navigation-menu > .navigation-item:nth-child(2) > .navigation-link',
        );
		await navPromise;

		await page.click(
            '.navigation-body > .navigation-body-section_ > .navigation-menu > .navigation-item:nth-child(2) > .navigation-link',
        );
        await page.waitForSelector(
			'.navigation-body > .navigation-body-section_ > .navigation-menu > .navigation-item:nth-child(3) > .navigation-link',
			);
		await navPromise;
        // await page.goto('https://logz.io/about-us');

    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if (browser) {
            await context.close();
            await browser.close();
        }
		return true
    }
    // const parsedData = convertHarToJSON(harData);
    // console.log(parsedData.result.length);

    // console.log(parsedData.flatEntries[1]);

    // parsedData.result.forEach((log) => {
    //     // console.log(log);
    //     logger.log(log);
    // });

    return true;
};
handler();
