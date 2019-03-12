'use strict';

import Component from '../../components/baseComponent/index';
import Button from "../../components/button/button";
import MainView from "../mainView/mainView";
import SettingsView from "../settingsView/settingsView";
import SigninView from "../authorizationViews/signinView/signinView";
import SignupView from "../authorizationViews/signupView/signupView";
import UserService from "../../services/user-service";
import EventBus from '../../modules/event-bus';
import Tabbar from "../../components/tabbar/tabbar";
import Checkbox from "../../components/checkbox/checkbox";
import {activeFullScreen, cancselFullScreen} from "../../modules/full-screen"

class BaseView {

    private _parent: Component;
    private _template = require('./baseView.pug');

    private _fullscreenButton: Checkbox;
    private _logoButton: Button;
    private _profileButton: Button;
    private _signoutButton: Button;
    private _modalWindows: Tabbar;
    private _authorizationSection: Component;

    constructor() {
        this._parent = Component.Create('div');
        document.body.insertBefore(this._parent.el, document.body.firstChild);
    }

    public render() : void {
        this._parent.el.innerHTML = this._template();

        const mainView = new MainView();
        const settingsView = new SettingsView();
        const signinView = new SigninView();
        const signupView = new SignupView();
        mainView.render();

        this._fullscreenButton = new Checkbox(document.querySelector('#full-screen'),
            () => activeFullScreen(),
            () => cancselFullScreen()
        );

        this._logoButton = new Button(document.querySelector('#logo'), () => {
            mainView.render();
        });

        this._profileButton = new Button(document.querySelector('#profile'), () => {
            UserService.me()
                .then(() => {
                    settingsView.render();
                })
                .catch(() => {
                    EventBus.publish('mod1', '');
                    // console.log(err.message);
                });
        });

        this._signoutButton = new Button(document.querySelector('#signout'), () => {
            UserService.signout()
                .catch(() => {
                    EventBus.publish('mod1', '');
                    // console.log(err.message);
                });
        });

        this._modalWindows = new Tabbar(document.querySelector('.modal__windows'), {
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

        this._authorizationSection = new Component(document.querySelector('.footer__left__content'));

        this.on();


        UserService.me()
            .then(() => {
                EventBus.publish('authorized', '');
            })
            .catch(() => {
                EventBus.publish('unauthorized', '');
            });
    }

    private on() : void {
        this._fullscreenButton.onChange();
        this._logoButton.onClick();
        this._profileButton.onClick();
        this._signoutButton.onClick();
        this._modalWindows.onChange();

        EventBus.subscribe('authorized', () => {
            this._authorizationSection.hide();
            this._profileButton.showAllReferences();
            this._signoutButton.showAllReferences();
        });

        EventBus.subscribe('unauthorized', () => {
            this._profileButton.hideAllReferences();
            this._signoutButton.hideAllReferences();
            this._authorizationSection.show();
        });
    }
}

export default BaseView;