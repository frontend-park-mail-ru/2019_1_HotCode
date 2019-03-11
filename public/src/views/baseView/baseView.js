'use strict';

import Component from '../../components/baseComponent/index.js';
import Button from "../../components/button/button";
import MainView from "../mainView/mainView";
import SettingsView from "../settingsView/settingsView";
import SigninView from "../authorizationViews/signinView/signinView";
import SignupView from "../authorizationViews/signupView/signupView";
import UserService from "../../services/user-service";
import EventBus from '../../modules/event-bus';
import Tabbar from "../../components/tabbar/tabbar";
import Checkbox from "../../components/checkbox/checkbox";

const baseTmpl = require('./baseView.pug');

function launchFullScreen() {
    const element = document.body;
    if(element.requestFullScreen) {
        element.requestFullScreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    }
}

function cancelFullscreen() {
    if(document.cancelFullScreen) {
        document.cancelFullScreen();
    } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if(document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
}

class BaseView {
    constructor() {
        const div = Component.Create('div');
        div.el.innerHTML = baseTmpl();
        document.body.insertBefore(div.el, document.body.firstChild);
    }

    render() {
        const mainView = new MainView();
        const settingsView = new SettingsView();
        const signinView = new SigninView();
        const signupView = new SignupView();
        mainView.render();

        this.fullscreenButton= new Checkbox(document.querySelector('#full-screen'),
            launchFullScreen,
            cancelFullscreen
        );
        this.mainButton = new Button(document.querySelector('#logo'), () => {
            mainView.render();
        });
        this.profileButton = new Button(document.querySelector('#profile'), () => {
            UserService.me()
                .then(() => {
                    settingsView.render();
                })
                .catch(() => {
                    EventBus.publish('mod1', '');
                    // console.log(err.message);
                });
        });
        this.signoutButton = new Button(document.querySelector('#signout'), () => {
            UserService.signout()
                .catch(() => {
                    EventBus.publish('mod1', '');
                    // console.log(err.message);
                });
        });
        this.authorizationSection = new Component(document.querySelector('.footer__left__content'));
        this.modalWindows = new Tabbar(document.querySelector('.modal__windows'), {
            'mod0': () => {
                signinView.clear();
                signupView.clear();
            },
            'mod1': () => {
                signupView.clear();
                signinView.render();
            },
            'mod2': () => {
                signinView.clear();
                signupView.render();
            },
        });

        this.fullscreenButton.onChange();
        this.mainButton.onClick();

        EventBus.subscribe('authorized', () => {
            this.authorizationSection.hide();
            this.profileButton.showAllReferences();
            this.signoutButton.showAllReferences();

            this.profileButton.onClick();

            this.signoutButton.onClick();
        });

        EventBus.subscribe('unauthorized', () => {
            this.profileButton.hideAllReferences();
            this.signoutButton.hideAllReferences();
            this.authorizationSection.show();

            this.modalWindows.onChange();
        });

        UserService.me()
            .then(() => {
                EventBus.publish('authorized', '');
            })
            .catch(() => {
                EventBus.publish('unauthorized', '');
            });
    }
}

export default BaseView;