'use strict';

import Component from "../../../components/baseComponent/index";
import UserService from "../../../services/user-service";
import SignupForm from "../../../components/form/signupForm";
import EventBus from '../../../modules/event-bus';
import ValidationError from "../../../components/form/utils/validationError";
import {signupFormConfig} from '../utils/formConfig';
import {events} from '../../../utils/events';

class SignupView {

    private _parent: Component;
    private _template = require('../formBaseView.pug');

    private _signupForm: SignupForm;

    constructor() {
        this._parent = new Component(document.querySelector('.modal__window'));
    }

    public render(): void {
        this._parent.el.innerHTML = this._template(signupFormConfig);

        this._signupForm = new SignupForm(this._parent.el.getElementsByTagName('form')[0]);

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
        this._parent.el.innerHTML = '';
        this._signupForm = null;
    }
}

export default SignupView;