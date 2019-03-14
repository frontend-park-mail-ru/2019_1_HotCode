'use strict';

import Component from "../../components/baseComponent/index";
import SettingsForm from "../../components/form/settingsForm";
import User from "../../models/user";
import UserService from "../../services/user-service";
import AvatarService from "../../services/avatar-service";
import ValidationError from "../../components/form/utils/validationError";
import EventBus from "../../modules/event-bus";
import {events} from '../../utils/events';
import Alert from '../../components/alert/alert';
import Message from '../../utils/message';

class SettingsView {

    private _parent: Component;
    private _template = require('./settingsView.pug');

    private settingsForm: SettingsForm;

    constructor() {
        this._parent = new Component(document.querySelector('div.container'));

        EventBus.subscribe(events.onOldPassword, () => {

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

        this.settingsForm = new SettingsForm(this._parent.el.getElementsByTagName('form')[0]);

        this.settingsForm.resetPasswords();

        EventBus.publish(events.onOldPassword);


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

                let promise = new Promise((resolve) => {

                    if (avatar) {
                        AvatarService.sendAvatar(avatar)
                            .then(resp => {
                                resolve(resp.photo_uuid);
                            })
                            .catch(() => {
                                Alert.alert(Message.fileFormatError(), true);
                            });

                        return;
                    }

                    resolve('');
                });

                promise.then((photo_uuid: string) => {

                    UserService.edit(username, oldPassword, newPassword, photo_uuid)
                        .then(() => {
                            this.settingsForm.resetPasswords();
                            Alert.alert(Message.successfulUpdate());
                            UserService.me();
                        })
                        .catch((err) => {
                            if (err.message && err.message === Message.emptyFormError()) {
                                Alert.alert(err.message, true);
                                return;
                            }
                            if (err.message) {
                                Alert.alert(Message.accessError(), true);
                                EventBus.publish(events.openSignIn, '');
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