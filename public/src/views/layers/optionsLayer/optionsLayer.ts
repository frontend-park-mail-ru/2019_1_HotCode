'use strict';

import Component from '../../../components/baseComponent/index';
import Button from "../../../components/button/button";
import UserService from "../../../services/user-service";
import EventBus from '../../../modules/event-bus';
import Tabbar from "../../../components/tabbar/tabbar";
import {events} from '../../../modules/utils/events';
import Alert from '../../../components/alert/alert';
import Message from "../../../utils/message";
import Layer from '../layer';
import ViewService from '../../../services/view-service';

class OptionsLayer extends Layer{

    private static template = require('./optionsLayer.pug');

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
        this.renderTmplBesideHTML(OptionsLayer.template);

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
        this.profileButton.clearAllReferences();
        this.profileButton.clear();
        this.profileButton = null;

        this.modalWindows.clear();
        this.modalWindows = null;

        this.modalWindowContainer.clear();
        this.modalWindowContainer = null;

        this.footerSection.clear();
        this.footerSection = null;

        console.log('options CLEAR');
    }

    private on() : void {
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

export default OptionsLayer;