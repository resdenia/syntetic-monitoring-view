var editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.session.setMode('ace/mode/javascript');

const settings = {
    notificationLoaded: '.loaded',
    notificationFailed: '.loaded-fail',
};

const notificationFileModify = document.querySelector('.fileCreated');
const notificationZipCreate = document.querySelector('.fileZip');
const notificationZipUpload = document.querySelector('.zipUploaded');
const notificationLambdaCreate = document.querySelector('.functionCreated');
const inputLambdaName = document.querySelector('#name');
const inputLambdaDescription = document.querySelector('#description');

const responseModifyFetch = async (code) => {
    return await fetch('/api/modify-file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            code: editor.getValue(),
        }),
    })
        .then((res) => res.json())
        .catch((err) => {
            console.log(err);
            //display error
            return err;
        });
};

const responseToZipFetch = async () => {
    return await fetch('/api/create-zip', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .catch((err) => {
            console.log(err);
            //display error
            return err;
        });
};

const responseUploadZipFetch = async () => {
    return await fetch('/api/uploadZip', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .catch((err) => {
            console.log(err); //display error
            return err;
        });
};
const responseCreateLambdaFetch = async (name, description) => {
    return await fetch('/api/create-lambda', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            description,
        }),
    })
        .then((res) => {
            return res.json();
        })
        .catch((err) => {
            console.log(err);
            return err;
            // document.querySelector('.backtrop').style.display = 'none';
        });
};

const initPage = () => {
    document
        .querySelector('.cloudFormation-test')
        .addEventListener('click', async () => {
            console.log('jere');
            await fetch('/api/create-cfn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        });
    document
        .querySelector('.submission-test')
        .addEventListener('click', async (e) => {
            e.preventDefault();
            const name = inputLambdaName.value;
            const description = inputLambdaDescription.value;

            notificationFileModify.style.display = 'flex';
            const responseModify = await responseModifyFetch(editor.getValue());
            if (!responseModify.error) {
                notificationZipCreate.style.display = 'flex';
                notificationFileModify.querySelector(
                    '.title-h4-white',
                ).textContent = 'Function Created';
                notificationFileModify.querySelector('.loading').style.display =
                    'none';
                notificationFileModify.querySelector('.loaded').style.display =
                    'block';
                // class notification fileCreated
            } else {
                notificationFileModify.querySelector('.loading').style.display =
                    'none';
                notificationFileModify.querySelector(
                    '.loaded-fail',
                ).style.display = 'block';
                return false;
            }
            const responseToZip = await responseToZipFetch();

            if (!responseToZip.error) {
                notificationZipUpload.style.display = 'flex';
                notificationZipCreate.querySelector(
                    '.title-h4-white',
                ).textContent = 'Zip Created';
                notificationZipCreate.querySelector('.loading').style.display =
                    'none';
                notificationZipCreate.querySelector('.loaded').style.display =
                    'block';
            } else {
                notificationZipCreate.querySelector('.loading').style.display =
                    'none';
                notificationZipCreate.querySelector(
                    '.loaded-fail',
                ).style.display = 'block';
                return false;
            }
            const responseUploadZip = await responseUploadZipFetch();

            if (!responseUploadZip.error) {
                notificationLambdaCreate.style.display = 'flex';
                notificationZipUpload.querySelector(
                    '.title-h4-white',
                ).textContent = 'Zip Uploaded';
                notificationZipUpload.querySelector('.loading').style.display =
                    'none';
                notificationZipUpload.querySelector('.loaded').style.display =
                    'block';
                const response = await responseCreateLambdaFetch(
                    name,
                    description,
                );
                if (!response.error) {
                    notificationLambdaCreate.querySelector(
                        '.title-h4-white',
                    ).textContent = 'Lambda Created';
                    notificationLambdaCreate.querySelector(
                        '.loading',
                    ).style.display = 'none';
                    notificationLambdaCreate.querySelector(
                        '.loaded',
                    ).style.display = 'block';
                    console.log('uploadZip success');
                    //class notification functionCreated
                    console.log('createZip success');

                    // document.querySelector('.backtrop').style.display = 'none';
                } else {
                    notificationLambdaCreate.querySelector(
                        '.loading',
                    ).style.display = 'none';
                    notificationLambdaCreate.querySelector(
                        '.loaded-fail',
                    ).style.display = 'block';
                    return false;
                }
            } else {
                console.log('uploadZip fail');
                notificationZipUpload.querySelector('.loading').style.display =
                    'none';
                notificationZipUpload.querySelector(
                    '.loaded-fail',
                ).style.display = 'block';
                //display  error can't modify file please check if you  don't have syntax errors
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

initPage();

class PageBuilder {
    constructor() {}

    startTest = () => {};
    tabLogic = () => {};
    errorDisplay = () => {};
    statusFromAPI = () => {};
}
