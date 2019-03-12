'use strict';

import Form from "./form";
import Field from "../field/field";
import Validation from "./utils/validation";

/**
 * SigninForm Component for SigninForm
 * @extends {Form}
 */
class SigninForm extends Form{

    private _usernameField: Field;
    private _passwordField: Field;

    constructor(el: HTMLElement) {
        super(el);

        const fields: HTMLElement[] = Array.from(this.el.querySelectorAll('.form__input'));

        this._usernameField = new Field(fields[0]);
        this._passwordField = new Field(fields[1]);
    }

    get usernameField(): Field {
        return this._usernameField;
    }

    get passwordField(): Field {
        return this._passwordField;
    }

    public validateUsername(): void {
        try {
            Validation.validateUsername(this._usernameField.getValue(), true);
            this._usernameField.clearError();
        } catch (usernameError) {
            this._usernameField.setError(usernameError.errorText);
        }
    }

    public validatePassword(): void {
        try {
            this._passwordField.clearError();
        } catch (passwordError) {
            this._passwordField.setError(passwordError.errorText);
        }
    }

    public validate(): boolean {
        this.validateUsername();
        this.validatePassword();

        return !this._usernameField.getErrorStatus() &&
            !this._passwordField.getErrorStatus();
    }
}

export default SigninForm;