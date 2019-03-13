'use strict';

import Component from "../../components/baseComponent/index";
import SettingsForm from "../../components/form/settingsForm";
import User from "../../models/user";
import UserService from "../../services/user-service";
import AvatarService from "../../services/avatar-service";
import ValidationError from "../../components/form/utils/validationError";
import EventBus from "../../modules/event-bus";

class SettingsView {

    private _parent: Component;
    private _template = require('./settingsView.pug');

    private settingsForm: SettingsForm;

    constructor() {
        this._parent = new Component(document.querySelector('div.container'));

        EventBus.subscribe('onOldPassword', () => {

            if (this.settingsForm.oldPasswordField.getValue()) {

                this.settingsForm.newPasswordField.show();
                this.settingsForm.repeatNewPasswordField.show();

                return
            }

            this.settingsForm.newPasswordField.hide();
            this.settingsForm.repeatNewPasswordField.hide();
        });
    }

    public render(): void {
        this._parent.el.innerHTML = this._template();

        this.settingsForm = new SettingsForm(this._parent.el.querySelector('form'));


        EventBus.publish('onOldPassword');


        this.settingsForm.usernameField.setValue(User.username);

        const image = new Component(this._parent.el.querySelector('.form__inputs__right img'));
        if (User.avatar) {
            (<HTMLImageElement>image.el).src = "https://warscript-images.herokuapp.com/photos/" + User.avatar;
        }


        this.settingsForm.usernameField.onInput(() => {
            this.settingsForm.validateUsername();
        });

        this.settingsForm.usernameField.onBlur(() => {
            this.settingsForm.validateUsernameOnUnique();
        });

        this.settingsForm.oldPasswordField.onInput(() => {
            EventBus.publish('onOldPassword');
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

                let promise = new Promise((resolve) => {

                    if (avatar) {
                        AvatarService.sendAvatar(avatar)
                            .then(resp => {
                                resolve(resp.photo_uuid);
                            })
                            .catch(() => {
                                // console.log(err);
                            });

                        return;
                    }

                    resolve('');
                });

                promise.then((photo_uuid: string) => {
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

    public clear(): void {
        this._parent.el.innerHTML = '';
        this.settingsForm = null;
    }
}

export default SettingsView;