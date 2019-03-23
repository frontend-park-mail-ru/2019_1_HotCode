'use strict';

import Component from '../../../components/baseComponent/index';
import Button from "../../../components/button/button";
import UserService from "../../../services/user-service";
import EventBus from '../../../modules/event-bus';
import Tabbar from "../../../components/tabbar/tabbar";
import Checkbox from "../../../components/checkbox/checkbox";
import {activeFullScreen, cancselFullScreen} from "../../../modules/full-screen";
import {events} from '../../../modules/utils/events';
import Alert from '../../../components/alert/alert';
import Message from "../../../utils/message";
import Parallax from '../../../modules/parallax';
import Layer from '../layer';
import ViewService from '../../../services/view-service';

class BaseView extends Layer{

    private static template = require('./baseView.pug');

    private _fullscreenButton: Checkbox;
    private _logoButton: Button;
    private _profileButton: Button;
    private _signoutButton: Button;
    private _modalWindows: Tabbar;
    private _authorizationSection: Component;

    constructor() {
        super(Component.Create());
        document.body.insertBefore(this.parent.el, document.body.firstChild);
    }

    public render() : void {
        this.renderTmpl(BaseView.template);

        const parallax = new Parallax(new Component(document.querySelector('.background')));
        parallax.moveBackground();

        Alert.updateElement();

        this._fullscreenButton = new Checkbox(document.querySelector('#full-screen'),
            () => activeFullScreen(),
            () => cancselFullScreen()
        );

        this._logoButton = new Button(document.querySelector('#logo'), () => {
            ViewService.goToMainView();
        });

        this._profileButton = new Button(document.querySelector('#profile'), () => {
            UserService.me()
                .then(() => {
                    ViewService.goToSettingsView();
                })
                .catch(() => {
                    EventBus.publish(events.openSignIn, '');
                    Alert.alert(Message.accessError(), true);
                });
        });

        this._signoutButton = new Button(document.querySelector('#signout'), () => {
            UserService.signout()
                .catch(() => {
                    EventBus.publish(events.openSignIn, '');
                    Alert.alert(Message.accessError(), true);
                });
        });

        this._modalWindows = new Tabbar(document.querySelector('.modal__windows'), {
            'mod0': () => {
                ViewService.goBack();
            },
            'mod1': () => {
                ViewService.goToLoginView();
            },
            'mod2': () => {
                ViewService.goToSignupView();
            },
        });

        this._authorizationSection = new Component(document.querySelector('.footer__left__content'));

        this.on();


        UserService.me()
            .then(() => {
                EventBus.publish(events.authorized, '');
            })
            .catch(() => {
                EventBus.publish(events.unauthorized, '');
            });
    }

    public clear() {
        console.log('base CLEAR');
    }

    private on() : void {
        this._fullscreenButton.onChange();
        this._logoButton.onClick();
        this._profileButton.onClick();
        this._signoutButton.onClick();
        this._modalWindows.onChange();

        EventBus.subscribe(events.authorized, () => {
            this._authorizationSection.hide();
            this._profileButton.showAllReferences();
            this._signoutButton.showAllReferences();
        });

        EventBus.subscribe(events.unauthorized, () => {
            this._profileButton.hideAllReferences();
            this._signoutButton.hideAllReferences();
            this._authorizationSection.show();
        });
    }
}

export default BaseView;