'use strict';

import Component from "../../../components/baseComponent";
import UserService from "../../../services/user-service";
import SignupForm from "../../../components/form/signupForm";
import EventBus from  '../../../modules/event-bus';

const formBaseTmpl = require('../formBaseView.pug');

class SignupView {
    constructor() {
        this.parent = new Component(document.querySelector('.modal__window'));
    }

    render() {
        this.parent.el.innerHTML = formBaseTmpl({
            logotype: 'Sign Up',
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
                },
                {
                    label: 'Repeat Password',
                    type: 'password',
                    name: 'repeatPassword'
                }
            ],
            submitButtonName: 'Create',
            otherButtonName: 'Login',
            nextFormNumber: 1
        });

        this.signupForm = new SignupForm(this.parent.el.getElementsByTagName('form')[0]);

        this.signupForm.usernameField.onBlur(() => {
            this.signupForm.validateUsername();
        });

        this.signupForm.passwordField.onBlur(() => {
            this.signupForm.validatePassword();
        });

        this.signupForm.passwordRepeatField.onBlur(() => {
            this.signupForm.validatePasswordEquality();
        });

        this.signupForm.onSubmit((event) => {
            event.preventDefault();
            const username = this.signupForm.usernameField.getValue();
            const password = this.signupForm.passwordField.getValue();


            if (this.signupForm.validate()) {
                UserService.signup(username, password, (err) => {
                    if (err) {
                        this.signupForm.usernameField.setError(err.username);
                    } else {
                        EventBus.publish('mod0', '')
                    }
                });
            }
        });
    }

    clear() {
        this.parent.el.innerHTML = '';
        this.signupForm = null;
    }
}

export default SignupView;