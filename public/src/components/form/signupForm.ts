'use strict';

import Form from "./form";
import Field from "../field/field";
import Validation from "./utils/validation";

/**
 * SignupForm Component for signupForm
 * @extends {Form}
 */
class SignupForm extends Form{

    private _usernameField: Field;
    private _passwordField: Field;
    private _passwordRepeatField: Field;

    constructor(el: HTMLElement) {
        super(el);

        const fields: HTMLElement[] = Array.from(this.el.querySelectorAll('.form__input'));

        this._usernameField = new Field(fields[0]);
        this._passwordField = new Field(fields[1]);
        this._passwordRepeatField = new Field(fields[2]);
    }

    get usernameField(): Field {
        return this._usernameField;
    }

    get passwordField(): Field {
        return this._passwordField;
    }

    get passwordRepeatField(): Field {
        return this._passwordRepeatField;
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
        Validation.validateUsernameOnUnique(this._usernameField.getValue())
            .then(() => {
                this._usernameField.clearError();
            })
            .catch(error => {
                this._usernameField.setError(error.errorText);
            });
    }

    public validatePassword(): void {
        try {
            Validation.validatePassword(this._passwordField.getValue());
            Validation.validatePasswordEquality(this._passwordField.getValue(),
                                                this._passwordRepeatField.getValue());
            this._passwordField.clearError();
        } catch (passwordError) {
            this._passwordField.setError(passwordError.errorText);
        }
    }

    public validatePasswordEquality(): void {
        try {
            Validation.validatePasswordEquality(this._passwordField.getValue(),
                                                this._passwordRepeatField.getValue());
            this._passwordField.clearError();
        } catch (passwordError) {
            this._passwordField.setError(passwordError.errorText);
        }
    }

    public validate(): boolean {
        this.validateUsername();
        this.validateUsernameOnUnique();
        this.validatePassword();

        return !this._usernameField.getErrorStatus() &&
            !this._passwordField.getErrorStatus() &&
            !this._passwordRepeatField.getErrorStatus();
    }
}

export default SignupForm;