var editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.session.setMode('ace/mode/javascript');

const initPage = () => {
    document
        .querySelector('#generalForm')
        .addEventListener('submit', async (e) => {
            e.preventDefault();
            document.querySelector('.backtrop').style.display = 'flex';
            const { name, description } = e.target;
            console.log(name.value);

            const response = await fetch('/api/create-lambda', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: editor.getValue(),
                    name: name.value,
                    description: description.value,
                }),
            })
                .then((res) => {
                    return res;
                })
                .catch((err) => console.log(err));
            if (response.ok) {
                document.querySelector('.backtrop').style.display = 'none';
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

    startTest() {}
}
