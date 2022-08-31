class Steps {
    constructor() {
        this.processFunction = null;
    }
    init = () => {
        this.clickFirstStep();
    };

    clickFirstStep = () => {
        const firstChoice = document.querySelectorAll('.choice');

        firstChoice.forEach((choice) => {
            choice.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(e.target.value);
                this.processFunction = e.target.value;
                document.querySelector('.first_step').style.display = 'none';
                document.querySelector('.third_step').style.display = 'flex';
            });
        });
    };
}

const steps = new Steps();

steps.init();
