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
        this.awsRegion = null;
        this.createNewOne = null;
        this.range_time = null;
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
                return res.json();
            })
            .catch((err) => {
                console.log(err);
                //display error
                return err;
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
        const errorContainer = document.querySelector('.errorStatus');
        const errorText = document.querySelector('.errorMessage');
        errorContainer.style.display = 'block';
        errorContainer.style.bottom = '10px';
        errorText.textContent = errorMessage;
        setTimeout(() => {
            errorContainer.style.bottom = '-20px';
            errorContainer.style.display = 'none';
            errorText.textContent = '';
        }, 10000);
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
                    endPointUrls.modifyFileUrl,
                );

                if (responseModify.ok) {
                    self.displayGoodStatus(
                        notificationFileModify,
                        notificationZipCreate,
                        'Function Created',
                    );
                } else {
                    this.errorDisplay(responseModify.error);
                    self.displayFailedStatus(notificationFileModify);
                    return false;
                }
                const responseToZip = await this.customFetch(
                    { message: 'success' },
                    endPointUrls.createZipUrl,
                );

                if (responseToZip.ok) {
                    self.displayGoodStatus(
                        notificationZipCreate,
                        notificationZipUpload,
                        'Zip Created',
                    );
                } else {
                    this.errorDisplay(responseToZip.error);
                    self.displayFailedStatus(notificationZipCreate);
                    return false;
                }

                const responseUploadZip = await this.customFetch(
                    {},
                    endPointUrls.uploadZipUrl,
                );

                if (responseUploadZip.ok) {
                    self.displayGoodStatus(
                        notificationZipUpload,
                        notificationLambdaCreate,
                        'Zip Uploaded',
                    );
                    const response = await this.customFetch(
                        { name, description },
                        endPointUrls.createLambdaUrl,
                    );

                    if (response.ok) {
                        self.displayGoodStatus(
                            notificationLambdaCreate,
                            null,
                            'Lambda Created',
                        );
                    } else {
                        this.errorDisplay(responseUploadZip.error);
                        self.displayFailedStatus(notificationLambdaCreate);
                        return false;
                    }
                } else {
                    this.errorDisplay(response.error);
                    self.displayFailedStatus(notificationZipUpload);
                    return false;
                }
                const cloudBridgeEventResp = await this.customFetch(
                    { name, range_time: this.range_time },
                    endPointUrls.addEventBridgeUrl,
                );
                if (cloudBridgeEventResp.ok) {
                    self.displayGoodStatus(
                        notificationAddRange,
                        null,
                        'Range time added',
                    );
                } else {
                    this.errorDisplay(responseUploadZip.error);
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
            const { access_key, secret_key, bucket_name, region, range_time } =
                e.target;

            if (
                access_key.value === '' ||
                secret_key.value === '' ||
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
                startTestButton.disabled = false;
            }
        });
    };
    init = () => {
        this.initPage();
        this.cloudFormationGenerator();
        this.tabLogic();
        this.configFormHandle();
    };
}

const pageBuilder = new PageBuilder();
pageBuilder.init();
