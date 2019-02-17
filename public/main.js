
const nav = document.getElementsByClassName('navigation')[0];
const elementCollection = Array.from(nav.children);
let curState = null;

const options = Array.from(document
    .getElementsByClassName('game__content')[0]
    .children);

document
    .getElementsByClassName('game__options__line')[0]
    .addEventListener('click', (event) => {
        if (curState === 'game__menu') {
            const elementClassName = event.target.getAttribute('data-option');
            console.log(elementClassName);

            options.forEach((element) => {
                element.classList.add('hidden');

                if (element.classList[0] === elementClassName) {
                    element.classList.remove('hidden');
                }
            });
        }
    });

document.addEventListener('click', (event) => {
    const elementClassName = event.target.getAttribute('data-section');
    console.log(event.target.className);
    console.log(curState);

    if (curState === 'signin__background') {
        if (event.target.className === 'signin__background') {
            nav.getElementsByClassName(curState)[0].classList.add('hidden');
        }
        curState = null;
    }
    else if (elementClassName === 'signin__background') {
        nav.getElementsByClassName(elementClassName)[0].classList.remove('hidden');
        curState = elementClassName;
    }
    else if (elementClassName !== null) {

        elementCollection.forEach((element) => {
            element.classList.add('hidden');

            if (element.classList[0] === elementClassName) {
                element.classList.remove('hidden');
            }
        });
        curState = elementClassName;
    }
});


