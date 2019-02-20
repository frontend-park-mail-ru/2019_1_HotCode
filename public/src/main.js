'use strict';

import '../style/index.scss';

const nav = document.getElementsByClassName('navigation')[0];
const elementCollection = Array.from(nav.children);
let curState = null;

const options = Array.from(document
    .getElementsByClassName('game__content')[0]
    .children);

document
    .getElementsByClassName('game__options__line')[0]
    .addEventListener('click', (event) => {
        if (curState === 'game') {
            const elementClassName = event.target.getAttribute('data-option');

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
    console.log(event.target.tagName);

    if (curState === 'signin' || curState === 'signup') {
        if (event.target.className === 'signin__background') {
            document.getElementById(curState).classList.add('hidden');
        }
        curState = null;
    }
    else if (elementClassName === 'signin' || elementClassName === 'signup') {
        document.getElementById(elementClassName).classList.remove('hidden');
        curState = elementClassName;
    }
    else if (elementClassName !== null) {

        elementCollection.forEach((element) => {
            element.classList.add('hidden');

            if (element.id === elementClassName) {
                element.classList.remove('hidden');
            }
        });
        curState = elementClassName;
    }
});


