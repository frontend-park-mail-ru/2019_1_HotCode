'use strict';

import Form from "./form";
import Field from "../field/field";
import Validation from "./utils/validation";

/**
 * SigninForm Component for SigninForm
 * @extends {Form}
 */
class SigninForm extends Form{
    constructor(el) {
        super(el);

        this.usernameField = new Field(this.el.querySelectorAll('.form__input')[0]);
        this.passwordField = new Field(this.el.querySelectorAll('.form__input')[1]);
    }

    validateUsername() {
        Validation.validateUsername(this.usernameField.getValue(), true)
            .then(() => {
                this.usernameField.clearError();
            })
            .catch(error => {
                this.usernameField.setError(error.errorText);
            });
    }

    validatePassword() {
        try {
            this.passwordField.clearError();
        } catch (passwordError) {
            this.passwordField.setError(passwordError.errorText);
        }
    }

    validate() {
        this.validateUsername();
        this.validatePassword();

        return !this.usernameField.getErrorStatus() &&
            !this.passwordField.getErrorStatus();
    }

}

export default SigninForm;