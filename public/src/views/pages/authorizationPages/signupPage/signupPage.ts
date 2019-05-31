'use strict';

import Component from "../../../../components/baseComponent/index";
import UserService from "../../../../services/user-service";
import SignupForm from "../../../../components/form/signupForm";
import EventBus from '../../../../modules/event-bus';
import ValidationError from "../../../../components/form/utils/validationError";
import {signupFormConfig} from '../utils/formConfig';
import {events} from '../../../../modules/utils/events';
import Page from '../../page';

class SignupPage extends Page {

    private static template = require('../formBasePage.pug');

    private signupForm: SignupForm;

    constructor(parent: Component) {
        super(parent, 'SignUp - WarScript');
    }

    public render(): void {
        super.render();
        this.renderTmpl(SignupPage.template, signupFormConfig);

        EventBus.publish(events.openSignUp, true);

        this.signupForm = new SignupForm(this.parent.el.querySelector('.form_theme_popup'));

        this.signupForm.usernameField.onInput(() => {
            this.signupForm.validateUsername();
        });

        this.signupForm.usernameField.onBlur(() => {
            this.signupForm.validateUsernameOnUnique();
        });

        this.signupForm.passwordField.onInput(() => {
            this.signupForm.validatePassword();
        });

        this.signupForm.passwordRepeatField.onInput(() => {
            this.signupForm.validatePasswordEquality();
        });

        this.signupForm.onSubmit((event) => {
            event.preventDefault();

            const username = this.signupForm.usernameField.getValue();
            const password = this.signupForm.passwordField.getValue();


            if (this.signupForm.validate()) {

                UserService.signup(username, password)
                    .catch((err) => {
                        if (err.username) {
                            this.signupForm.usernameField.setError(ValidationError.uniqueError());
                        }

                        throw new Error('');
                    })
                    .then(() => {
                        EventBus.publish(events.closeModal);
                        return UserService.me();
                    })
                    .then(() => {

                        EventBus.publish(events.authorized, '');
                    })
                    .catch(() => {
                        return;
                    });
            }
        });
    }

    public clear(): void {
        this.parent.el.innerHTML = '';
        this.signupForm = null;
        EventBus.publish(events.closeModal, true);
        console.log('signup CLEAR');
    }
}

export default SignupPage;