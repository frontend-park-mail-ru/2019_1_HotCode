'use strict';

import Form from "./form";
import Field from "../field/field";
import Validation from "./utils/validation";
import ImageInput from "../imageInput/imageInput";
import Component from "../baseComponent";
import User from '../../models/user';

/**
 * SettingsForm Component for SettingsForm
 * @extends {Form}
 */
class SettingsForm extends Form{
    constructor(el) {
        super(el);

        this.usernameField = new Field(this.el.querySelectorAll('.form__input')[0]);
        this.oldPasswordField = new Field(this.el.querySelectorAll('.form__input')[1]);
        this.newPasswordField = new Field(this.el.querySelectorAll('.form__input')[2]);
        this.repeatNewPasswordField = new Field(this.el.querySelectorAll('.form__input')[3]);
        this.avatarField = new ImageInput(this.el.querySelector('#avatar'), (event) => {
            const avatar = event.target.files[0];
            if (avatar && avatar.type.startsWith('image/')) {
                const image = new Component(this.el.querySelector('.form__inputs__right img'));
                image.el.file = avatar;

                const reader = new FileReader();
                reader.onload = (function (aImg) {
                    return function (e) {
                        aImg.src = e.target.result;
                    };
                })(image.el);
                reader.readAsDataURL(avatar);
            }
        });
    }

    resetPasswords() {
        this.oldPasswordField.clearValue();
        this.newPasswordField.clearValue();
        this.repeatNewPasswordField.clearValue();
    }

    validateUsername() {
        if (User.username !== this.usernameField.getValue()) {
            Validation.validateUsername(this.usernameField.getValue())
                .then(() => {
                    this.usernameField.clearError();
                })
                .catch(error => {
                    this.usernameField.setError(error.errorText);
                });
        } else {
            this.usernameField.clearError();
        }
    }

    validateOldPassword() {
        try {
            this.oldPasswordField.clearError();
        } catch (passwordError) {
            this.oldPasswordField.setError(passwordError.errorText);
        }
    }

    validateNewPassword() {
        try {
            Validation.validatePassword(this.newPasswordField.getValue());
            Validation.validatePasswordEquality(this.newPasswordField.getValue(),
                this.repeatNewPasswordField.getValue());
            this.newPasswordField.clearError();
        } catch (passwordError) {
            this.newPasswordField.setError(passwordError.errorText);
        }
    }

    validateNewPasswordEquality() {
        try {
            Validation.validatePasswordEquality(this.newPasswordField.getValue(),
                this.repeatNewPasswordField.getValue());
            this.newPasswordField.clearError();
        } catch (passwordError) {
            this.newPasswordField.setError(passwordError.errorText);
        }
    }

    validate() {
        this.validateUsername();
        this.validateOldPassword();
        this.validateNewPassword();

        return !this.usernameField.getErrorStatus() &&
            !this.oldPasswordField.getErrorStatus() &&
            !this.newPasswordField.getErrorStatus() &&
            !this.repeatNewPasswordField.getErrorStatus();
    }

}

export default SettingsForm;