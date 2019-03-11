'use strict';

import Component from "../../components/baseComponent";
import SettingsForm from "../../components/form/settingsForm";
import User from "../../models/user";
import UserService from "../../services/user-service";
import AvatarService from "../../services/avatar-service";
import ValidationError from "../../components/form/utils/validationError";
import EventBus from "../../modules/event-bus";

const settingsTmpl = require('./settingsView.pug');

class SettingsView {
    constructor() {
        this.parent = new Component(document.querySelector('div.container'));
    }

    render() {
        this.parent.el.innerHTML = settingsTmpl();

        this.settingsForm = new SettingsForm(this.parent.el.querySelector('form'));

        this.settingsForm.usernameField.setValue(User.username);

        // TODO Исправить
        const image = new Component(this.parent.el.querySelector('.form__inputs__right img'));
        if (User.avatar) {
            image.el.src = "https://warscript-images.herokuapp.com/photos/" + User.avatar;  // Hi, it's http
        }

        this.settingsForm.usernameField.onBlur(() => {
            this.settingsForm.validateUsername();
        });

        this.settingsForm.newPasswordField.onBlur(() => {
            this.settingsForm.validateNewPassword();
        });

        this.settingsForm.repeatNewPasswordField.onBlur(() => {
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

            const avatar = this.settingsForm.avatarField.getFile();

            if (this.settingsForm.validate()) {
                let promise = new Promise((resolve) => {
                    if (avatar) {
                        AvatarService.sendAvatar(avatar)
                            .then(resp => {
                                resolve(resp.photo_uuid);
                            })
                            .catch(() => {
                                // console.log(err);
                            });
                    } else {
                        resolve('');
                    }
                });

                promise.then((photo_uuid) => {
                    UserService.edit(username, oldPassword, newPassword, photo_uuid)
                        .then(() => {
                            this.settingsForm.resetPasswords();
                            UserService.me();
                        })
                        .catch((err) => {
                            if (err.message) {
                                EventBus.publish('mod1', '');
                            }
                            if (err.username) {
                                this.settingsForm.usernameField.setError(ValidationError.uniqueError());
                            }
                            if (err.oldPassword) {
                                this.settingsForm.oldPasswordField.setError(ValidationError.invalidPasswordError());
                            }
                        });
                });
            }
        });
    }

    clear() {
        this.parent.el.innerHTML = '';
        this.settingsForm = null;
    }
}

export default SettingsView;