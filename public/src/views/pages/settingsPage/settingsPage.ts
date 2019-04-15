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
import Button from '../../../components/button/button';
import Checkbox from '../../../components/checkbox/checkbox';
import Modal from '../../../components/modal/modal';
import PhotoLoader from '../../../components/photoLoader/photoLoader';

class SettingsPage extends Page {

    private static template = require('./settingsPage.pug');

    private settingsForm: SettingsForm;
    private settingsBack: Button;
    private chooseAvatarButton: Checkbox;
    private chooseAvatarModal: Modal;

    private onNewPassword: {[key: string]: () => void};

    constructor(parent: Component) {
        super(parent, 'Settings - WarScript');
    }

    public render(): void {
        super.render();
        this.renderTmpl(SettingsPage.template);

        this.settingsBack = new Button(this.parent.el.querySelector('#settings-back'),
            () => {
            history.back();
        });
        this.settingsBack.onClick();

        this.settingsForm = new SettingsForm(this.parent.el.querySelector('.form_theme_settings'));

        this.chooseAvatarModal = new Modal(
            this.parent.el.querySelector('.modal__window_theme_settings'),
            'choose-avatar',
        );

        this.chooseAvatarModal.content = this.settingsForm.photoLoader;

        this.chooseAvatarButton = new Checkbox(this.parent.el.querySelector('#choose-avatar'),
                () => {
                    this.chooseAvatarModal.render();
                },
                () => {
                    this.chooseAvatarModal.clear();
                },
            );
        this.chooseAvatarButton.onChange();

        this.onNewPassword = EventBus.subscribe(events.onNewPassword, () => {

            if (this.settingsForm.newPasswordField.getValue()) {

                this.settingsForm.repeatNewPasswordField.show();
                this.settingsForm.oldPasswordField.show();

                return;
            }

            this.settingsForm.repeatNewPasswordField.hide();
            this.settingsForm.oldPasswordField.hide();
        });

        this.settingsForm.resetPasswords();

        EventBus.publish(events.onNewPassword);


        this.settingsForm.usernameField.setValue(User.username);

        if (User.avatar) {

            const image = new Component(this.parent.el.querySelector('.avatar__image'));
            const spiner = new Component(this.parent.el.querySelector('.carousel__item__spinner'));

            spiner.show();
            AvatarService.getAvatar(User.avatar)
                .then((img) => {
                    (image.el as HTMLImageElement).src = URL.createObjectURL(img);
                    image.show();
                })
                .finally(() => {
                    spiner.hide();
                });
        }

        this.settingsForm.usernameField.onInput(() => {
            this.settingsForm.validateUsername();
        });

        this.settingsForm.usernameField.onBlur(() => {
            this.settingsForm.validateUsernameOnUnique();
        });

        this.settingsForm.newPasswordField.onInput(() => {
            EventBus.publish(events.onNewPassword);
            this.settingsForm.validateNewPassword();
        });

        this.settingsForm.repeatNewPasswordField.onInput(() => {
            this.settingsForm.validateNewPasswordEquality();
        });

        this.settingsForm.onSubmit((event) => {
            event.preventDefault();

            let username = this.settingsForm.usernameField.getValue();
            if (username === User.username) {
                username = '';
            }

            const oldPassword = this.settingsForm.oldPasswordField.getValue();
            const newPassword = this.settingsForm.newPasswordField.getValue();

            const avatar: File = this.settingsForm.photoLoader.resultFile;//this.settingsForm.photoLoader.resultFile64 ;

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
        this.onNewPassword.unsubscribe();
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