var editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.session.setMode('ace/mode/javascript');

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
// Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
// console.log(params.script);

// editor.setValue(window.atob(params.script));

const initPage = () => {
    document.querySelector('#generalForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const { name, description } = e.target;
        console.log(name.value);
        fetch('/api/create-lambda', {
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
};

initPage();
