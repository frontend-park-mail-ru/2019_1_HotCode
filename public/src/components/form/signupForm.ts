'use strict';

import Form from "./form";
import Field from "../field/field";
import Validation from "./utils/validation";

/**
 * SignupForm Component for signupForm
 * @extends {Form}
 */
class SignupForm extends Form{

    private username: Field;
    private password: Field;
    private passwordRepeat: Field;

    constructor(el: HTMLElement) {
        super(el);

        const fields: HTMLElement[] = Array.from(this.el.querySelectorAll('.field'));

        this.username = new Field(fields[0]);
        this.password = new Field(fields[1]);
        this.passwordRepeat = new Field(fields[2]);
    }

    get usernameField(): Field {
        return this.username;
    }

    get passwordField(): Field {
        return this.password;
    }

    get passwordRepeatField(): Field {
        return this.passwordRepeat;
    }

    public validateUsername(): void {
        try {

            Validation.validateUsername(this.username.getValue());
            this.username.clearError();

        } catch (usernameError) {
            this.username.setError(usernameError.errorText);
        }
    }

    public validateUsernameOnUnique(): void {
        Validation.validateUsernameOnUnique(this.username.getValue())
            .then(() => {
                this.username.clearError();
            })
            .catch((error) => {
                this.username.setError(error.errorText);
            });
    }

    public validatePassword(): void {
        try {

            Validation.validatePassword(this.password.getValue());

            if (!this.password.virginity &&
                !this.passwordRepeat.virginity) {

                Validation.validatePasswordEquality(this.password.getValue(),
                    this.passwordRepeat.getValue());
            }

            this.password.clearError();

        } catch (passwordError) {
            this.password.setError(passwordError.errorText);
        }
    }

    public validatePasswordEquality(): void {
        try {

            if (!this.password.virginity &&
                !this.passwordRepeat.virginity) {

                Validation.validatePasswordEquality(this.password.getValue(),
                    this.passwordRepeat.getValue());
            }

            this.password.clearError();

        } catch (passwordError) {
            this.password.setError(passwordError.errorText);
        }
    }

    public validate(): boolean {
        this.validateUsername();
        this.validateUsernameOnUnique();
        this.validatePassword();

        return !this.username.getErrorStatus() &&
            !this.password.getErrorStatus() &&
            !this.passwordRepeat.getErrorStatus();
    }
}

export default SignupForm;