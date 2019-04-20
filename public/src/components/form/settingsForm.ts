'use strict';

import Form from "./form";
import Field from "../field/field";
import Validation from "./utils/validation";
import ImageInput from "../imageInput/imageInput";
import Component from "../baseComponent/index";
import User from '../../models/user';
import PhotoLoader from '../photoLoader/photoLoader';

/**
 * SettingsForm Component for SettingsForm
 * @extends {Form}
 */
class SettingsForm extends Form{

    private username: Field;
    private oldPassword: Field;
    private newPassword: Field;
    private repeatNewPassword: Field;
    private photoLoaderField: PhotoLoader;

    constructor(el: HTMLElement) {
        super(el);

        const fields: HTMLElement[] = Array.from(this.el.querySelectorAll('.field'));

        this.username = new Field(fields[0]);

        this.newPassword = new Field(fields[1]);

        this.repeatNewPassword = new Field(fields[2]);

        this.oldPassword = new Field(fields[3]);

        this.photoLoaderField = new PhotoLoader(Component.Create().el);
    }

    get usernameField(): Field {
        return this.username;
    }

    get oldPasswordField(): Field {
        return this.oldPassword;
    }

    get newPasswordField(): Field {
        return this.newPassword;
    }

    get repeatNewPasswordField(): Field {
        return this.repeatNewPassword;
    }

    get photoLoader(): PhotoLoader {
        return this.photoLoaderField;
    }

    public validateUsername(): void {
        try {

            Validation.validateUsername(this.username.getValue());
            this.username.clearError();

        } catch (usernameError) {
            this.username.setError(usernameError.text);
        }
    }

    public validateUsernameOnUnique(): void {
        if (User.username !== this.username.getValue()) {

            Validation.validateUsernameOnUnique(this.username.getValue())
                .then(() => {
                    this.username.clearError();
                })
                .catch((error) => {
                    this.username.setError(error.errorText);
                });

            return;
        }

        this.username.clearError();
    }

    public validateOldPassword(): void {
        try {

            this.oldPassword.clearError();

        } catch (passwordError) {
            this.oldPassword.setError(passwordError.errorText);
        }
    }

    public validateNewPassword(): void {
        try {

            console.log(!!this.oldPassword.getValue());
            if (!!this.oldPassword.getValue()) {
                Validation.validatePassword(this.newPassword.getValue());
            }

            if (!this.newPassword.virginity &&
                !this.repeatNewPassword.virginity) {

                Validation.validatePasswordEquality(this.newPassword.getValue(),
                    this.repeatNewPassword.getValue());
            }

            this.newPassword.clearError();
        } catch (passwordError) {
            this.newPassword.setError(passwordError.errorText);
        }
    }

    public validateNewPasswordEquality(): void {
        try {
            if (!this.newPassword.virginity &&
                !this.repeatNewPassword.virginity) {

                Validation.validatePasswordEquality(this.newPassword.getValue(),
                    this.repeatNewPassword.getValue());
            }

            this.newPassword.clearError();

        } catch (passwordError) {
            this.newPassword.setError(passwordError.errorText);
        }
    }

    public validate(): boolean {
        this.validateUsername();
        this.validateOldPassword();
        this.validateNewPassword();

        return !this.username.getErrorStatus() &&
            !this.oldPassword.getErrorStatus() &&
            !this.newPassword.getErrorStatus() &&
            !this.repeatNewPassword.getErrorStatus();
    }

    public resetPasswords(): void {
        this.oldPassword.clearValue();
        this.newPassword.clearValue();
        this.repeatNewPassword.clearValue();
    }
}

export default SettingsForm;