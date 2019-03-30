'use strict';

import Form from "./form";
import Field from "../field/field";
import Validation from "./utils/validation";
import ImageInput from "../imageInput/imageInput";
import Component from "../baseComponent/index";
import User from '../../models/user';

/**
 * SettingsForm Component for SettingsForm
 * @extends {Form}
 */
class SettingsForm extends Form{

    private username: Field;
    private oldPassword: Field;
    private newPassword: Field;
    private repeatNewPassword: Field;
    private avatar: ImageInput;

    constructor(el: HTMLElement) {
        super(el);

        const fields: HTMLElement[] = Array.from(this.el.querySelectorAll('.form__input'));

        this.username = new Field(fields[0]);

        this.oldPassword = new Field(fields[1]);

        this.newPassword = new Field(fields[2]);

        this.repeatNewPassword = new Field(fields[3]);

        this.avatar = new ImageInput(this.el.querySelector('#avatar'), (event) => {
            const avatar = event.target.files[0];

            if (avatar && avatar.type.startsWith('image/')) {

                const image = new Component(this.el.querySelector('.form__inputs__right img'));
                (image.el as HTMLImageElement).src = avatar;

                const reader = new FileReader();
                reader.onload = ((aImg) => {
                    return (e: Event) => {
                        (aImg as HTMLImageElement).src = (e.target as any).result;
                    };
                })(image.el);
                reader.readAsDataURL(avatar);
            }
        });
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

    get avatarField(): ImageInput {
        return this.avatar;
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

            if (this.oldPassword.getValue()) {

                Validation.validatePassword(this.newPassword.getValue());

                if (!this.newPassword.virginity &&
                    !this.repeatNewPassword.virginity) {

                    Validation.validatePasswordEquality(this.newPassword.getValue(),
                        this.repeatNewPassword.getValue());
                }

            }

            this.newPassword.clearError();
        } catch (passwordError) {
            this.newPassword.setError(passwordError.errorText);
        }
    }

    public validateNewPasswordEquality(): void {
        try {
            if (this.oldPassword.getValue() &&
                !this.newPassword.virginity &&
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