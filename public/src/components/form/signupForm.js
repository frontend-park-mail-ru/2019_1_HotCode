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
        try {
            Validation.validateUsername(this.usernameField.getValue());
            this.usernameField.clearError();
        } catch (usernameError) {
            this.usernameField.setError(usernameError.errorText);
        }
    }

    validateUsernameOnUnique() {
        Validation.validateUsernameOnUnique(this.usernameField.getValue())
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
        this.validateUsernameOnUnique();
        this.validatePassword();

        return !this.usernameField.getErrorStatus() &&
            !this.passwordField.getErrorStatus() &&
            !this.passwordRepeatField.getErrorStatus();
    }
}

export default SignupForm;