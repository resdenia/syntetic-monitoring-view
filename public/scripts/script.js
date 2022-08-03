var editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.session.setMode('ace/mode/javascript');

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
            // code: editor.getValue(),
            name: name.value,
            description: description.value,
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
        .querySelector('#generalForm')
        .addEventListener('submit', async (e) => {
            e.preventDefault();
            // document.querySelector('.backtrop').style.display = 'flex';
            const { name, description } = e.target;

            const responseModify = await responseModifyFetch(editor.getValue());
            if (!responseModify.error) {
            } else {
                console.log('modifyfile fail');
                //display  error can't modify file please check if you  don't have syntax errors
                return false;
            }
            const responseToZip = await responseToZipFetch();

            if (!responseToZip.error) {
                console.log('tozip success');

                //display status
            } else {
                //display  error can't modify file please check if you  don't have syntax errors
                console.log('tozip fail');
                return false;
            }
            const responseUploadZip = await responseUploadZipFetch();

            if (!responseUploadZip.error) {
                console.log('uploadZip success');

                // request create Lambda  /api/create-lambda
            } else {
                console.log('uploadZip fail');

                //display  error can't modify file please check if you  don't have syntax errors
                return false;
            }
            const response = await responseCreateLambdaFetch(name, description);

            console.log(response);
            if (!response.ok) {
                console.log('createZip success');

                // document.querySelector('.backtrop').style.display = 'none';
            }
            //display status
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

    startTest() {}
}
