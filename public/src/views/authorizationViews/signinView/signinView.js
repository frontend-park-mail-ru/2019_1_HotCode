'use strict';

import Component from "../../../components/baseComponent";
import UserService from "../../../services/user-service";
import SigninForm from "../../../components/form/signinForm";
import EventBus from "../../../modules/event-bus";
import ValidationError from "../../../components/form/utils/validationError";

const formBaseTmpl = require('../formBaseView.pug');

class SigninView {
    constructor() {
        this.parent = new Component(document.querySelector('.modal__window'));
    }

    render() {
        this.parent.el.innerHTML = formBaseTmpl({
            logotype: 'Sign in',
            formFields: [
                {
                    label: 'Username',
                    type: 'text',
                    name: 'username',
                    placeholder: 'Human325'
                },
                {
                    label: 'Password',
                    type: 'password',
                    name: 'password'
                }
            ],
            submitButtonName: 'Login',
            otherButtonName: 'Sign up',
            nextFormNumber: 2
        });

        this.signinForm = new SigninForm(this.parent.el.getElementsByTagName('form')[0]);

        this.signinForm.usernameField.onBlur(() => {
            this.signinForm.validateUsername();
        });

        this.signinForm.onSubmit((event) => {
            event.preventDefault();
            const username = this.signinForm.usernameField.getValue();
            const password = this.signinForm.passwordField.getValue();

            if (this.signinForm.validate()) {
                UserService.auth(username, password)
                    .then(() => {
                        EventBus.publish('mod0', '');
                    })
                    .catch((err) => {
                        if (err.username) {
                            this.signinForm.usernameField.setError(ValidationError.notExistError());
                        }
                        if (err.password) {
                            this.signinForm.passwordField.setError(ValidationError.invalidPasswordError());
                        }
                    });
            }
        });
    }

    clear() {
        this.parent.el.innerHTML = '';
        this.signinForm = null;
    }
}

export default SigninView;