'use strict';

import Form from "./form";
import Field from "../field/field";
import Validation from "./utils/validation";

/**
 * SigninForm Component for SigninForm
 * @extends {Form}
 */
class SigninForm extends Form{

    private username: Field;
    private password: Field;

    constructor(el: HTMLElement) {
        super(el);

        const fields: HTMLElement[] = Array.from(this.el.querySelectorAll('.form__input'));

        this.username = new Field(fields[0]);
        this.password = new Field(fields[1]);
    }

    get usernameField(): Field {
        return this.username;
    }

    get passwordField(): Field {
        return this.password;
    }

    public validateUsername(): void {
        try {

            Validation.validateUsername(this.username.getValue(), true);
            this.username.clearError();

        } catch (usernameError) {
            this.username.setError(usernameError.errorText);
        }
    }

    public validatePassword(): void {
        try {

            this.password.clearError();

        } catch (passwordError) {
            this.password.setError(passwordError.errorText);
        }
    }

    public validate(): boolean {
        this.validateUsername();
        this.validatePassword();

        return !this.username.getErrorStatus() &&
            !this.password.getErrorStatus();
    }
}

export default SigninForm;