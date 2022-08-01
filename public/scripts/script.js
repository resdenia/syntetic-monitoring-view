var editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.session.setMode('ace/mode/javascript');

const initPage = () => {
    document
        .querySelector('#generalForm')
        .addEventListener('submit', async (e) => {
            e.preventDefault();
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
            });
        });

    const allTabs = document.querySelectorAll('.tab-control-item');
    allTabs.forEach((tab) => {
        tab.addEventListener('click', (e) => {
            e.stopPropagation();
            console.dir(e.target.attributes['istab'].nodeValue);
            console.dir(e.target.attributes['isactivetab'].nodeValue);

            if (!e.target.classList.contains('active')) {
                document
                    .querySelector('.tab-control-item.active')
                    .classList.remove('active');
                e.target.classList.add('active');
                // document.querySelector();
            }
        });
    });
};

initPage();
