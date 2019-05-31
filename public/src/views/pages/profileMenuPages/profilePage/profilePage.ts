'use strict';

import Component from "../../../../components/baseComponent/index";
import Page from '../../page';
import User from "../../../../models/user";
import AnotherUser from "../../../../models/anotherUser";
import EventBus from '../../../../modules/event-bus';
import {events} from '../../../../modules/utils/events';
import SettingsForm from '../../../../components/form/settingsForm';
import SettingsPage from '../../settingsPage/settingsPage';
import ValidationError from '../../../../components/form/utils/validationError';
import Alert from '../../../../components/alert/alert';
import UserService from '../../../../services/user-service';
import Message from '../../../../utils/message';
import Button from '../../../../components/button/button';
import ViewService from '../../../../services/view-service';

class ProfilePage extends Page{

    private static template = require('./profilePage.pug');

    private profileForm: SettingsForm;
    private choiseButton: Component;
    private keyTextContent: Component;
    private copyVkKeyButton: Button;
    private genNewVkKeyButton: Button;

    private onUsernameChange: {[key: string]: () => void};
    private onVkKeyChange: {[key: string]: () => void};

    constructor(parent: Component) {
        super(parent, 'Profile - WarScript');
    }

    public render(): void {
        super.render();
        this.renderTmpl(ProfilePage.template);

        this.choiseButton = new Component(document.querySelector('.menu__item__option_theme_profile'));

        let onUserLoad: {[key: string]: () => void};
        let onAnotherUserLoad: {[key: string]: () => void};

        EventBus.subscribe(events.onUserIDRender, () => {
            EventBus.publish(events.onOpenProfile, true);
        });
        EventBus.subscribe(events.onAnotherUserIDChange, () => {
            EventBus.publish(events.onOpenProfile, true);
        });

        if (User.id || AnotherUser.id) {

            EventBus.publish(events.onOpenProfile, true);
        }

        this.choiseButton.active();


        this.profileForm = new SettingsForm(this.parent.el.querySelector('.form_theme_profile'));

        this.profileForm.resetPasswords();

        this.keyTextContent = new Component(this.parent.el.querySelector('.profile__item__content__key'));

        this.copyVkKeyButton = new Button(this.parent.el.querySelector('#copyVkKeyButton'), () => {

            (this.keyTextContent.el as HTMLInputElement).select();
            document.execCommand("copy");
            Alert.alert(Message.successCopyKey());

        });
        this.copyVkKeyButton.onClick();

        this.genNewVkKeyButton = new Button(this.parent.el.querySelector('#genNewVkKeyButton'), () => {

        });
        this.genNewVkKeyButton.onClick();


        this.onUsernameChange = EventBus.subscribe(events.onUsernameChange, () => {
            this.handleUsernameChange();
        });

        this.handleUsernameChange();

        this.onVkKeyChange = EventBus.subscribe(events.onVkKeyChange, () => {

            this.handleVkKeyChange();
        });

        this.handleVkKeyChange();

        this.profileForm.usernameField.onInput(() => {
            this.profileForm.validateUsername();
        });

        this.profileForm.usernameField.onBlur(() => {
            this.profileForm.validateUsernameOnUnique();
        });

        this.profileForm.newPasswordField.onInput(() => {
            this.profileForm.validateNewPassword();
        });

        this.profileForm.repeatNewPasswordField.onInput(() => {
            this.profileForm.validateNewPasswordEquality();
        });


        this.profileForm.onSubmit((event) => {
            event.preventDefault();

            let username = this.profileForm.usernameField.getValue();
            if (username === User.username) {
                username = '';
            }

            const oldPassword = this.profileForm.oldPasswordField.getValue();
            const newPassword = this.profileForm.newPasswordField.getValue();


            const newUserData =
                ProfilePage.getNewUserObject(username, oldPassword, newPassword);

            if (Object.keys(newUserData).length === 0) {
                Alert.alert(Message.emptyFormError(), true);
                return;
            }

            if (this.profileForm.validate()) {

                UserService.edit(newUserData)
                    .then(() => {

                        if (this.profileForm) {

                            this.profileForm.resetPasswords();
                        }
                        Alert.alert(Message.successfulUpdate());
                        UserService.me();
                    })
                    .catch((err) => {

                        if (err && err.message) {

                            Alert.alert(Message.accessError(), true);
                            EventBus.publish(events.openSignIn, '');

                        }
                        if (err && err.username) {

                            this.profileForm.usernameField.setError(ValidationError.uniqueError());

                        }
                        if (err && err.oldPassword) {

                            this.profileForm.oldPasswordField.setError(ValidationError.invalidPasswordError());
                        }
                    });
            }
        });
    }

    public clear(): void {
        this.parent.el.innerHTML = '';

        this.choiseButton.disactive();

        this.choiseButton = null;
        this.profileForm = null;

        this.onUsernameChange.unsubscribe();
        this.onVkKeyChange.unsubscribe();
    }

    private handleUsernameChange = () => {

        if (User.username) {

            this.profileForm.usernameField.setValue(User.username);
        }
    };

    private handleVkKeyChange = () => {

        if (User.key) {
            (this.keyTextContent.el as HTMLInputElement).value = User.key;
        }
    };

    private static getNewUserObject(username: string,
                                    oldPassword: string,
                                    newPassword: string): {[key: string]: string} {

        const user: {[key: string]: string} = {};

        if (username) {
            user.username = username;
        }

        if (oldPassword) {
            user.oldPassword = oldPassword;
            user.newPassword = newPassword;
        }

        return user;
    }
}

export default ProfilePage;