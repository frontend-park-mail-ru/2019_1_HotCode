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

    private _usernameField: Field;
    private _oldPasswordField: Field;
    private _newPasswordField: Field;
    private _repeatNewPasswordField: Field;
    private _avatarField: ImageInput;

    constructor(el: HTMLElement) {
        super(el);

        const fields: HTMLElement[] = Array.from(this.el.querySelectorAll('.form__input'));

        this._usernameField = new Field(fields[0]);

        this._oldPasswordField = new Field(fields[1]);

        this._newPasswordField = new Field(fields[2]);

        this._repeatNewPasswordField = new Field(fields[3]);

        this._avatarField = new ImageInput(this.el.querySelector('#avatar'), (event) => {
            const avatar = event.target.files[0];

            if (avatar && avatar.type.startsWith('image/')) {

                const image = new Component(this.el.querySelector('.form__inputs__right img'));
                (<HTMLImageElement>image.el).src = avatar;

                const reader = new FileReader();
                reader.onload = (function (aImg) {
                    return function (e: Event) {
                        (<HTMLImageElement>aImg).src = (<any>e.target).result;
                    };
                })(image.el);
                reader.readAsDataURL(avatar);
            }
        });
    }

    get usernameField(): Field {
        return this._usernameField;
    }

    get oldPasswordField(): Field {
        return this._oldPasswordField;
    }

    get newPasswordField(): Field {
        return this._newPasswordField;
    }

    get repeatNewPasswordField(): Field {
        return this._repeatNewPasswordField;
    }

    get avatarField(): ImageInput {
        return this._avatarField;
    }

    public validateUsername(): void {
        try {

            Validation.validateUsername(this._usernameField.getValue());
            this._usernameField.clearError();

        } catch (usernameError) {
            this._usernameField.setError(usernameError.errorText);
        }
    }

    public validateUsernameOnUnique(): void {
        if (User.username !== this._usernameField.getValue()) {

            Validation.validateUsernameOnUnique(this._usernameField.getValue())
                .then(() => {
                    this._usernameField.clearError();
                })
                .catch(error => {
                    this._usernameField.setError(error.errorText);
                });

            return;
        }

        this._usernameField.clearError();
    }

    public validateOldPassword(): void {
        try {

            this._oldPasswordField.clearError();

        } catch (passwordError) {
            this._oldPasswordField.setError(passwordError.errorText);
        }
    }

    public validateNewPassword(): void {
        try {

            if (this._oldPasswordField.getValue()) {

                Validation.validatePassword(this._newPasswordField.getValue());

                if (!this._newPasswordField.virginityField &&
                    !this._repeatNewPasswordField.virginityField) {

                    Validation.validatePasswordEquality(this._newPasswordField.getValue(),
                        this._repeatNewPasswordField.getValue());
                }

            }

            this._newPasswordField.clearError();
        } catch (passwordError) {
            this._newPasswordField.setError(passwordError.errorText);
        }
    }

    public validateNewPasswordEquality(): void {
        try {
            if (this._oldPasswordField.getValue() &&
                !this._newPasswordField.virginityField &&
                !this._repeatNewPasswordField.virginityField) {

                Validation.validatePasswordEquality(this._newPasswordField.getValue(),
                    this._repeatNewPasswordField.getValue());
            }

            this._newPasswordField.clearError();

        } catch (passwordError) {
            this._newPasswordField.setError(passwordError.errorText);
        }
    }

    public validate(): boolean {
        this.validateUsername();
        this.validateOldPassword();
        this.validateNewPassword();

        return !this._usernameField.getErrorStatus() &&
            !this._oldPasswordField.getErrorStatus() &&
            !this._newPasswordField.getErrorStatus() &&
            !this._repeatNewPasswordField.getErrorStatus();
    }

    public resetPasswords(): void {
        this._oldPasswordField.clearValue();
        this._newPasswordField.clearValue();
        this._repeatNewPasswordField.clearValue();
    }
}

export default SettingsForm;