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

class PageBuilder {
    constructor() {
        this.awsAccessKey = null;
        this.awsSecretKey = null;
        this.awsBucketName = null;
        this.awsRegion = null;
        this.createNewOne = null;
    }
    customFetch = async (bodyToSend, url) => {
        return await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyToSend),
        })
            .then((res) => res.json())
            .catch((err) => {
                console.log(err);
                //display error
                return err;
            });
    };
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
    initPage = () => {
        document
            .querySelector('.submission-test')
            .addEventListener('click', async (e) => {
                e.preventDefault();
                const name = inputLambdaName.value;
                const description = inputLambdaDescription.value;

                notificationFileModify.style.display = 'flex';
                const responseModify = await this.customFetch(
                    { code: editor.getValue() },
                    '/api/modify-file',
                );

                if (!responseModify.error) {
                    this.displayGoodStatus(
                        notificationFileModify,
                        notificationZipCreate,
                        'Function Created',
                    );
                } else {
                    this.displayFailedStatus(notificationFileModify);
                    return false;
                }
                const responseToZip = await this.customFetch(
                    {},
                    '/api/create-zip',
                );

                if (!responseToZip.error) {
                    this.displayGoodStatus(
                        notificationZipCreate,
                        notificationZipUpload,
                        'Zip Created',
                    );
                } else {
                    this.displayFailedStatus(notificationZipCreate);
                    return false;
                }

                const responseUploadZip = await responseUploadZipFetch(
                    {},
                    '/api/uploadZip',
                );

                if (!responseUploadZip.error) {
                    this.displayGoodStatus(
                        notificationZipUpload,
                        notificationLambdaCreate,
                        'Zip Uploaded',
                    );
                    const response = await this.customFetch(
                        { name, description },
                        '/api/create-lambda',
                    );

                    if (!response.error) {
                        this.displayGoodStatus(
                            notificationLambdaCreate,
                            null,
                            'Lambda Created',
                        );
                    } else {
                        this.displayFailedStatus(notificationLambdaCreate);
                        return false;
                    }
                } else {
                    this.displayFailedStatus(notificationZipUpload);
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
}
const pageBuilder = new PageBuilder();

pageBuilder.initPage();
