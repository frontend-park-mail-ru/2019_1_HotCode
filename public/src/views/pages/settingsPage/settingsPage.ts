'use strict';

import Alert from '../../../components/alert/alert';
import AvatarService from "../../../services/avatar-service";
import Component from "../../../components/baseComponent/index";
import EventBus from "../../../modules/event-bus";
import SettingsForm from "../../../components/form/settingsForm";
import ValidationError from "../../../components/form/utils/validationError";
import User from "../../../models/user";
import UserService from "../../../services/user-service";
import {events} from '../../../modules/utils/events';
import Message from '../../../utils/message';
import Page from '../page';

class SettingsPage extends Page {

    private static template = require('./settingsPage.pug');

    private settingsForm: SettingsForm;

    private onOldPassword: {[key: string]: () => void};

    constructor(parent: Component) {
        super(parent, 'Settings - WarScript');
    }

    public render(): void {
        super.render();
        this.renderTmpl(SettingsPage.template);

        this.settingsForm = new SettingsForm(this.parent.el.getElementsByTagName('form')[0]);

        this.onOldPassword = EventBus.subscribe(events.onOldPassword, () => {

            if (this.settingsForm.oldPasswordField.getValue()) {

                this.settingsForm.newPasswordField.show();
                this.settingsForm.repeatNewPasswordField.show();

                return;
            }

            this.settingsForm.newPasswordField.hide();
            this.settingsForm.repeatNewPasswordField.hide();
        });

        this.settingsForm.resetPasswords();

        EventBus.publish(events.onOldPassword);


        this.settingsForm.usernameField.setValue(User.username);

        const image = new Component(this.parent.el.querySelector('.form__inputs__right img'));
        if (User.avatar) {
            (image.el as HTMLImageElement).src = "https://warscript-images.herokuapp.com/photos/" + User.avatar;
        }


        this.settingsForm.usernameField.onInput(() => {
            this.settingsForm.validateUsername();
        });

        this.settingsForm.usernameField.onBlur(() => {
            this.settingsForm.validateUsernameOnUnique();
        });

        this.settingsForm.oldPasswordField.onInput(() => {
            EventBus.publish(events.onOldPassword);
        });

        this.settingsForm.newPasswordField.onInput(() => {
            this.settingsForm.validateNewPassword();
        });

        this.settingsForm.repeatNewPasswordField.onInput(() => {
            this.settingsForm.validateNewPasswordEquality();
        });


        this.settingsForm.avatarField.onChange();

        this.settingsForm.onSubmit((event) => {
            event.preventDefault();

            let username = this.settingsForm.usernameField.getValue();
            if (username === User.username) {
                username = '';
            }

            const oldPassword = this.settingsForm.oldPasswordField.getValue();
            const newPassword = this.settingsForm.newPasswordField.getValue();

            const avatar: File = this.settingsForm.avatarField.getFile();

            if (this.settingsForm.validate()) {

                this.sendAvatar(avatar)
                    .then((photoUuid: string) => {

                        const newUserData =
                            SettingsPage.getNewUserObject(username, oldPassword, newPassword, photoUuid);

                        if (Object.keys(newUserData).length === 0) {
                            throw new Error('');
                        }

                        return newUserData;
                    })
                    .catch(() => {

                        throw Alert.alert(Message.emptyFormError(), true);
                    })
                    .then((newUser) => {

                        return UserService.edit(newUser);
                    })
                    .then(() => {

                        this.settingsForm.resetPasswords();
                        Alert.alert(Message.successfulUpdate());
                        UserService.me();
                    })
                    .catch((err) => {

                        if (err && err.message) {

                            Alert.alert(Message.accessError(), true);
                            EventBus.publish(events.openSignIn, '');

                        }
                        if (err && err.username) {

                            this.settingsForm.usernameField.setError(ValidationError.uniqueError());

                        }
                        if (err && err.oldPassword) {

                            this.settingsForm.oldPasswordField.setError(ValidationError.invalidPasswordError());
                        }
                    });
            }
        });
    }

    public clear(): void {
        this.parent.el.innerHTML = '';
        this.onOldPassword.unsubscribe();
        this.settingsForm = null;
        console.log('settings CLEAR');
    }


    private sendAvatar(avatar: File): Promise<any> {
        return new Promise((resolve) => {

            if (avatar) {
                AvatarService.sendAvatar(avatar)
                    .then((resp) => {
                        if (User.avatar !== resp.photo_uuid) {
                            resolve(resp.photo_uuid);
                        }
                        resolve('');
                    })
                    .catch(() => {
                        Alert.alert(Message.fileFormatError(), true);
                    });

                return;
            }

            resolve('');
        });
    }

    private static getNewUserObject(username: string,
                                    oldPassword: string,
                                    newPassword: string,
                                    photoUuid: string): {[key: string]: string} {

        const user: {[key: string]: string} = {};

        if (username) {
            user.username = username;
        }

        if (oldPassword) {
            user.oldPassword = oldPassword;
            user.newPassword = newPassword;
        }

        if (photoUuid) {
            user.photo_uuid = photoUuid;
        }

        return user;
    }
}

export default SettingsPage;