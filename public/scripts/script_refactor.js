var editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.session.setMode('ace/mode/javascript');

const settings = {
    notificationLoaded: '.loaded',
    notificationFailed: '.loaded-fail',
    statusName: {},
    endPointUrls: {},
};

const notificationFileModify = document.querySelector('.fileCreated');
const notificationZipCreate = document.querySelector('.fileZip');
const notificationZipUpload = document.querySelector('.zipUploaded');
const notificationLambdaCreate = document.querySelector('.functionCreated');
const inputLambdaName = document.querySelector('#name');
const inputLambdaDescription = document.querySelector('#description');
const customFetch = async (bodyToSend, url) => {
    let settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    if (Object.keys(bodyToSend).length > 0) {
        settings = { ...settings, body: JSON.stringify(bodyToSend) };
    } else {
        settings = {
            ...settings,
            body: JSON.stringify({ message: 'processing' }),
        };
    }
    return await fetch(`http://localhost:8080${url}`, settings)
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

class PageBuilder {
    constructor() {
        this.awsAccessKey = null;
        this.awsSecretKey = null;
        this.awsBucketName = null;
        this.awsRegion = null;
        this.createNewOne = null;
    }

    startTest = () => {};
    tabLogic = () => {};
    errorDisplay = () => {};
    statusFromAPI = () => {};
    cloudFormationGenerator = () => {
        document
            .querySelector('.cloudFormation-test')
            .addEventListener('click', async () => {
                await fetch('/api/create-cfn', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            });
    };
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
                const responseModify = await customFetch(
                    { code: editor.getValue() },
                    '/api/modify-file',
                );

                if (!responseModify.error) {
                    self.displayGoodStatus(
                        notificationFileModify,
                        notificationZipCreate,
                        'Function Created',
                    );
                } else {
                    self.displayFailedStatus(notificationFileModify);
                    return false;
                }
                const responseToZip = await customFetch(
                    { message: 'success' },
                    '/api/create-zip',
                );

                if (!responseToZip.error) {
                    self.displayGoodStatus(
                        notificationZipCreate,
                        notificationZipUpload,
                        'Zip Created',
                    );
                } else {
                    self.displayFailedStatus(notificationZipCreate);
                    return false;
                }

                const responseUploadZip = await customFetch(
                    {},
                    '/api/uploadZip',
                );

                if (!responseUploadZip.error) {
                    self.displayGoodStatus(
                        notificationZipUpload,
                        notificationLambdaCreate,
                        'Zip Uploaded',
                    );
                    const response = await customFetch(
                        { name, description },
                        '/api/create-lambda',
                    );

                    if (!response.error) {
                        self.displayGoodStatus(
                            notificationLambdaCreate,
                            null,
                            'Lambda Created',
                        );
                    } else {
                        self.displayFailedStatus(notificationLambdaCreate);
                        return false;
                    }
                } else {
                    self.displayFailedStatus(notificationZipUpload);
                    return false;
                }
            });

        const allTabs = document.querySelectorAll('.tab-control-item');
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
    init = async () => {
        await this.initPage();
    };
}

(async () => {
    const pageBuilder = new PageBuilder();
    await pageBuilder.init();
    pageBuilder.cloudFormationGenerator();
    console.log;
})();
