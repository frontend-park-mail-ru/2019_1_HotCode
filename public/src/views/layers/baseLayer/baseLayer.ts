'use strict';

import Component from '../../../components/baseComponent/index';
import Button from "../../../components/button/button";
import Checkbox from "../../../components/checkbox/checkbox";
import {activeFullScreen, cancselFullScreen} from "../../../modules/full-screen";
import Parallax from '../../../modules/parallax';
import Layer from '../layer';
import ViewService from '../../../services/view-service';
import Tabbar from '../../../components/tabbar/tabbar';
import Alert from '../../../components/alert/alert';
import Message from '../../../utils/message';
import {events} from '../../../modules/utils/events';
import UserService from '../../../services/user-service';
import EventBus from '../../../modules/event-bus';

class BaseLayer extends Layer{

    private static template = require('./baseLayer.pug');

    private fullscreenButton: Checkbox;
    private logoButton: Button;
    private background: Component;
    private menuMobile: Component;

    private profileButton: Button;
    private signoutButton: Button;
    private modalWindows: Tabbar;
    private authorizationSection: Component;
    private footerSection: Component;
    private modalWindowContainer: Component;

    constructor(parent: Component) {
        super(parent);
    }

    public render() : void {
        this.renderTmplBesideHTML(BaseLayer.template);

        this.background = new Component(this.parent.el.querySelector('.background'));

        const parallax = new Parallax(this.background);
        parallax.moveBackground();

        this.menuMobile = new Component(this.parent.el.querySelector('nav.nav'));

        this.fullscreenButton = new Checkbox(this.parent.el.querySelector('#full-screen'),
            () => activeFullScreen(),
            () => cancselFullScreen()
        );

        this.logoButton = new Button(this.parent.el.querySelector('#logo'), () => {
            ViewService.goToMainView();
        });

        this.profileButton = new Button(this.parent.el.querySelector('#profile'), () => {
            UserService.me()
                .then(() => {
                    ViewService.goToSettingsView();
                })
                .catch(() => {
                    EventBus.publish(events.openSignIn, '');
                    Alert.alert(Message.accessError(), true);
                });
        });

        this.signoutButton = new Button(this.parent.el.querySelector('#signout'), () => {
            UserService.signout()
                .catch(() => {
                    EventBus.publish(events.openSignIn, '');
                    Alert.alert(Message.accessError(), true);
                });
        });

        this.modalWindows = new Tabbar(this.parent.el.querySelector('.modal__windows'), {
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

        this.authorizationSection = new Component(this.parent.el.querySelector('.footer__left__content'));

        this.footerSection = new Component(this.parent.el.querySelector('footer.container'));

        this.modalWindowContainer = new Component(this.parent.el.querySelector('.modal__window'));

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
        this.background.clear();
        this.background = null;

        this.menuMobile.clear();
        this.menuMobile = null;

        this.fullscreenButton.clearAllReferences();
        this.fullscreenButton.clear();
        this.fullscreenButton = null;

        this.logoButton.clearAllReferences();
        this.logoButton.clear();
        this.logoButton = null;

        this.profileButton.clearAllReferences();
        this.profileButton.clear();
        this.profileButton = null;

        this.modalWindows.clear();
        this.modalWindows = null;

        this.modalWindowContainer.clear();
        this.modalWindowContainer = null;

        this.footerSection.clear();
        this.footerSection = null;

        console.log('base CLEAR');
    }

    private on() : void {
        this.fullscreenButton.onChange();
        this.logoButton.onClick();
        this.profileButton.onClick();
        this.signoutButton.onClick();
        this.modalWindows.onChange();

        EventBus.subscribe(events.authorized, () => {
            this.authorizationSection.hide();
            this.profileButton.showAllReferences();
            this.signoutButton.showAllReferences();
        });

        EventBus.subscribe(events.unauthorized, () => {
            this.profileButton.hideAllReferences();
            this.signoutButton.hideAllReferences();
            this.authorizationSection.show();
        });
    }
}

export default BaseLayer;