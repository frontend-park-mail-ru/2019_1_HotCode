'use strict';

import '../style/index.scss';
import UserService from './services/user-service.js';
import Component from './components/component/index.js';
import From from './components/form/index.js';


const userService = new UserService();

// userService.auth('username', 'password', (err, res) => {
//     console.log(err, res);
// });

const signinForm = new Component(document.getElementsByClassName('signin__form')[0]);
const signupForm = new Component(document.getElementsByClassName('signup__form')[0]);

signinForm.on('submit', (event) => {
    event.preventDefault();
    const username = signinForm.el.elements['username'].value;
    const password = signinForm.el.elements['password'].value;

    userService.auth(username, password, (err, resp) => {
        console.log(err, resp);
        if (err) {
            alert(`AUTH Error: ${err.status}`);
        }

        signinForm.el.reset();
    });
});

signupForm.on('submit', (event) => {
    event.preventDefault();
    const username = signupForm.el.elements['username'].value;
    const password = signupForm.el.elements['password'].value;
    const repeatPassword = signupForm.el.elements['repeatPassword'].value;

    userService.signup(username, password, repeatPassword, (err, resp) => {
        console.log(err, resp);
        if (err) {
            alert(`Signup Error: ${err.status}`);
        }

        signupForm.el.reset();
    });
});

const profileButton = new Component(document.getElementsByClassName('profile__button')[0]);
const settings = new Component(document.getElementById('settings'));
const logoButton = new Component(document.getElementsByClassName('logo__button')[0]);
const main = new Component(document.getElementById('main'));

profileButton.on('click', (event) => {
    main.hide();
    settings.show();

    userService.me((err, resp) => {
        if (err) {
            alert(`ME  Error: ${err.status}`);
        }
        settings.el.getElementsByTagName('input')[0].value = resp.username;
        settings.el.getElementsByTagName('input')[1].value = resp.password;
    });
});

logoButton.on('click', (event) => {
    settings.hide();
    main.show();
});




//
// const nav = document.getElementsByClassName('navigation')[0];
// const elementCollection = Array.from(nav.children);
// let curState = null;
//
// const options = Array.from(document
//     .getElementsByClassName('game__content')[0]
//     .children);
//
// document
//     .getElementsByClassName('game__options__line')[0]
//     .addEventListener('click', (event) => {
//         if (curState === 'game') {
//             const elementClassName = event.target.getAttribute('data-option');
//
//             options.forEach((element) => {
//                 element.classList.add('hidden');
//
//                 if (element.classList[0] === elementClassName) {
//                     element.classList.remove('hidden');
//                 }
//             });
//         }
//     });
//
// document.addEventListener('click', (event) => {
//     const elementClassName = event.target.getAttribute('data-section');
//     console.log(event.target.tagName);
//
//     if (curState === 'signin' || curState === 'signup') {
//         if (event.target.className === 'signin__background') {
//             document.getElementById(curState).classList.add('hidden');
//         }
//         curState = null;
//     }
//     else if (elementClassName === 'signin' || elementClassName === 'signup') {
//         document.getElementById(elementClassName).classList.remove('hidden');
//         curState = elementClassName;
//     }
//     else if (elementClassName !== null) {
//
//         elementCollection.forEach((element) => {
//             element.classList.add('hidden');
//
//             if (element.id === elementClassName) {
//                 element.classList.remove('hidden');
//             }
//         });
//         curState = elementClassName;
//     }
// });
//
//
