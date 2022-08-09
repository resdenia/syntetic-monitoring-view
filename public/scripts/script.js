const editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.session.on('changeMode', function (e, session) {
    if ('ace/mode/javascript' === session.getMode().$id) {
        if (!!session.$worker) {
            session.$worker.send('setOptions', [
                {
                    esversion: 9,
                    esnext: false,
                },
            ]);
        }
    }
});
editor.session.setMode('ace/mode/javascript');

const settings = {
    notificationLoaded: '.loaded',
    notificationFailed: '.loaded-fail',
    statusName: {
        functionCreated: 'Function Created',
        zipCreated: 'Zip Created',
        zipUploaded: 'Zip Uploaded',
        lambdaCreated: 'Lambda Created',
        rangeTimeAdded: 'Range time added',
    },
    endPointUrls: {
        modifyFileUrl: '/api/modify-file',
        createZipUrl: '/api/create-zip',
        uploadZipUrl: '/api/uploadZip',
        createLambdaUrl: '/api/create-lambda',
        addEventBridgeUrl: '/api/add-eventbridge',
        modifyFileLocalUrl: '/api/modify-file-local',
    },
};

const notificationFileModify = document.querySelector('.fileCreated');
const notificationZipCreate = document.querySelector('.fileZip');
const notificationZipUpload = document.querySelector('.zipUploaded');
const notificationLambdaCreate = document.querySelector('.functionCreated');
const notificationAddRange = document.querySelector('.timeoutAdded');
const inputLambdaName = document.querySelector('#name');
const inputLambdaDescription = document.querySelector('#description');
const allTabs = document.querySelectorAll('.tab-control-item');
const configForm = document.querySelector('.config-form');
const allConfigInputs = document.querySelectorAll('.config-form input');
const startTestButton = document.querySelector('.submission-test');
class PageBuilder {
    constructor() {
        this.awsAccessKey = null;
        this.awsSecretKey = null;
        this.awsBucketName = null;
        this.shipping_token = null;
        this.awsRegion = null;
        this.createNewOne = null;
        this.range_time = 1;
    }
    customFetch = async (bodyToSend, url) => {
        return await fetch(`http://localhost:8080${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            ...(Object.keys(bodyToSend).length > 0
                ? { body: JSON.stringify(bodyToSend) }
                : {}),
        })
            .then((res) => {
                console.log(res);
                if (res.ok) {
                    return res.json();
                } else {
                    throw res;
                }
            })
            .catch((err) => {
                console.log(err);
                //display error
                return err.json();
            });
    };
    startTest = () => {};
    tabLogic = () => {
        allTabs.forEach((tab) => {
            tab.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!e.target.classList.contains('active')) {
                    document
                        .querySelector('.tab-control-item.active')
                        .classList.remove('active');
                    e.target.classList.add('active');
                    document
                        .querySelector('.tab-body-item.active')
                        .classList.remove('active');
                    document
                        .querySelector(
                            `[isTabBody=${e.target.attributes['istab'].nodeValue}]`,
                        )
                        .classList.add('active');
                }
            });
        });
    };
    errorDisplay = (errorMessage) => {
        console.log(errorMessage);
        try {
            const errorContainer = document.querySelector('.errorStatus');
            const errorText = document.querySelector('.errorMessage');
            errorContainer.style.display = 'block';
            errorContainer.style.bottom = '10px';
            if (errorMessage.err && errorMessage.err.code) {
                errorText.textContent = `${errorMessage.err.code}: ${errorMessage.err.message}`;
            } else {
                errorText.textContent = errorMessage;
            }
            setTimeout(() => {
                errorContainer.style.bottom = '-20px';
                errorContainer.style.display = 'none';
                errorText.textContent = '';
            }, 10000);
        } catch (err) {}
    };
    statusFromAPI = () => {};

    displayGoodStatus = (notification, notificationNext, buttonText) => {
        if (notificationNext) {
            notificationNext.style.display = 'flex';
        }
        notification.querySelector('.title-h4-white').textContent = buttonText;
        notification.querySelector('.loading').style.display = 'none';
        notification.querySelector('.loaded').style.display = 'block';
    };
    displayFailedStatus = (notification) => {
        notification.querySelector('.loading').style.display = 'none';
        notification.querySelector('.loaded-fail').style.display = 'block';
    };
    initPage = async () => {
        const self = this;
        document
            .querySelector('.submission-test')
            .addEventListener('click', async (e) => {
                e.preventDefault();
                const name = inputLambdaName.value;
                const description = inputLambdaDescription.value;

                notificationFileModify.style.display = 'flex';
                const responseModify = await this.customFetch(
                    { code: editor.getValue() },
                    settings.endPointUrls.modifyFileUrl,
                );
                if (!responseModify.error) {
                    self.displayGoodStatus(
                        notificationFileModify,
                        notificationZipCreate,
                        'Function Created',
                    );
                } else {
                    this.errorDisplay(responseModify.errorData);
                    self.displayFailedStatus(notificationFileModify);
                    return false;
                }
                const responseToZip = await this.customFetch(
                    { message: 'success' },
                    settings.endPointUrls.createZipUrl,
                );
                if (!responseToZip.error) {
                    self.displayGoodStatus(
                        notificationZipCreate,
                        notificationZipUpload,
                        'Zip Created',
                    );
                } else {
                    this.errorDisplay(responseToZip.errorData);
                    self.displayFailedStatus(notificationZipCreate);
                    return false;
                }

                const responseUploadZip = await this.customFetch(
                    {},
                    settings.endPointUrls.uploadZipUrl,
                );
                if (!responseUploadZip.error) {
                    self.displayGoodStatus(
                        notificationZipUpload,
                        notificationLambdaCreate,
                        'Zip Uploaded',
                    );
                    const response = await this.customFetch(
                        { name, description },
                        settings.endPointUrls.createLambdaUrl,
                    );

                    if (!response.error) {
                        self.displayGoodStatus(
                            notificationLambdaCreate,
                            notificationAddRange,
                            'Lambda Created',
                        );
                    } else {
                        this.errorDisplay(response.errorData);
                        self.displayFailedStatus(notificationLambdaCreate);
                        return false;
                    }
                } else {
                    this.errorDisplay(responseUploadZip.errorData);
                    self.displayFailedStatus(notificationZipUpload);
                    return false;
                }
                const cloudBridgeEventResp = await this.customFetch(
                    { name, range_time: this.range_time },
                    settings.endPointUrls.addEventBridgeUrl,
                );
                if (!cloudBridgeEventResp.error) {
                    self.displayGoodStatus(
                        notificationAddRange,
                        null,
                        'Range time added',
                    );
                } else {
                    console.log(cloudBridgeEventResp);
                    this.errorDisplay(cloudBridgeEventResp.errorData);
                    self.displayFailedStatus(notificationAddRange);
                    return false;
                }
            });
    };
    disableButtonConfig = () => {
        allConfigInputs.forEach((input) => {
            input.addEventListener('input', (e) => {
                if (startTestButton.disabled === false) {
                    startTestButton.disabled = true;
                }
            });
        });
    };
    configFormHandle = () => {
        configForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const {
                access_key,
                secret_key,
                bucket_name,
                region,
                range_time,
                shipping_token,
            } = e.target;

            if (
                access_key.value === '' ||
                secret_key.value === '' ||
                shipping_token.value === '' ||
                bucket_name.value === '' ||
                region.value === ''
            ) {
                startTestButton.disabled = true;
            } else {
                this.awsAccessKey = access_key.value;
                this.awsBucketName = bucket_name.value;
                this.awsSecretKey = secret_key.value;
                this.region = region.value;
                this.range_time = range_time;
                this.shipping_token = shipping_token;
                startTestButton.disabled = false;
            }
        });
    };
    init = () => {
        this.initPage();
        this.tabLogic();
        this.testLocal();
        this.configFormHandle();
    };
    validInput = () => {};
    testLocal = async () => {
        document
            .querySelector('.test-locally')
            .addEventListener('click', async (e) => {
                document.querySelector('.link-har').classList.add('hidden');
                const responseModify = await this.customFetch(
                    { code: editor.getValue() },
                    settings.endPointUrls.modifyFileLocalUrl,
                );
                if (!responseModify.error) {
                    document
                        .querySelector('.link-har')
                        .classList.remove('hidden');
                }
            });
    };
}

const pageBuilder = new PageBuilder();
pageBuilder.init();
