'use strict';

import Form from "./form";
import Field from "../field/field";
import Validation from "./utils/validation";

/**
 * SignupForm Component for signupForm
 * @extends {Form}
 */
class SignupForm extends Form{
    constructor(el) {
        super(el);

        this.usernameField = new Field(this.el.querySelectorAll('.form__input')[0]);
        this.passwordField = new Field(this.el.querySelectorAll('.form__input')[1]);
        this.passwordRepeatField = new Field(this.el.querySelectorAll('.form__input')[2]);
    }

    validateUsername() {
        Validation.validateUsername(this.usernameField.getValue())
            .then(() => {
                this.usernameField.clearError();
            })
            .catch(error => {
                this.usernameField.setError(error.errorText);
            });
    }

    validatePassword() {
        try {
            Validation.validatePassword(this.passwordField.getValue());
            Validation.validatePasswordEquality(this.passwordField.getValue(),
                                                this.passwordRepeatField.getValue());
            this.passwordField.clearError();
        } catch (passwordError) {
            this.passwordField.setError(passwordError.errorText);
        }
    }

    validatePasswordEquality() {
        try {
            Validation.validatePasswordEquality(this.passwordField.getValue(),
                                                this.passwordRepeatField.getValue());
            this.passwordField.clearError();
        } catch (passwordError) {
            this.passwordField.setError(passwordError.errorText);
        }
    }

    validate() {
        this.validateUsername();
        this.validatePassword();

        return !this.usernameField.getErrorStatus() &&
            !this.passwordField.getErrorStatus() &&
            !this.passwordRepeatField.getErrorStatus();
    }
}

export default SignupForm;