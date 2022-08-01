exports.handler = async (event, context) => {
    let browser = null;
    let harData = null;
    try {
        browser = await playwright.launchChromium();
        const context = await browser.newContext();

        const page = await context.newPage();
        const playwrightHar = new PlaywrightHar(page);
        await playwrightHar.start();

        // Your code starts here

        // Your code ends here

        harData = await playwrightHar.stop();
    } catch (error) {
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
    try {
        const parsedData = parseHarFile(harData);
        parsedData.probes[0].requests.forEach((log) => {
            logger.log({ message: log });
        });
    } catch (err) {
        console.log(err);
    }
    logger.sendAndClose();
    await sleep(4000);

    return true;
};
