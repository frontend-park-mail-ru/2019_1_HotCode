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

    private _signupForm: SignupForm;

    constructor(parent: Component) {
        super(parent, 'SignUp - WarScript');
    }

    public render(): void {
        super.render();
        this.renderTmpl(SignupPage.template, signupFormConfig);

        this._signupForm = new SignupForm(this.parent.el.getElementsByTagName('form')[0]);

        this._signupForm.usernameField.onInput(() => {
            this._signupForm.validateUsername();
        });

        this._signupForm.usernameField.onBlur(() => {
            this._signupForm.validateUsernameOnUnique();
        });

        this._signupForm.passwordField.onInput(() => {
            this._signupForm.validatePassword();
        });

        this._signupForm.passwordRepeatField.onInput(() => {
            this._signupForm.validatePasswordEquality();
        });

        this._signupForm.onSubmit((event) => {
            event.preventDefault();

            const username = this._signupForm.usernameField.getValue();
            const password = this._signupForm.passwordField.getValue();


            if (this._signupForm.validate()) {

                UserService.signup(username, password)
                    .then(() => {
                        EventBus.publish(events.closeModal, '');
                    })
                    .catch((err) => {
                        if (err.username) {
                            this._signupForm.usernameField.setError(ValidationError.uniqueError());
                        }
                    });
            }
        });
    }

    public clear(): void {
        this.parent.el.innerHTML = '';
        this._signupForm = null;
    }
}

export default SignupPage;