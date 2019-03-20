'use strict';

import Component from "../../../components/baseComponent/index";
import UserService from "../../../services/user-service";
import SigninForm from "../../../components/form/signinForm";
import EventBus from "../../../modules/event-bus";
import ValidationError from "../../../components/form/utils/validationError";
import {signinFormConfig} from '../utils/formConfig';
import {events} from '../../../utils/events';

class SigninView {

    private _parent: Component;
    private _template = require('../formBaseView.pug');

    private _signinForm: SigninForm;

    constructor() {
        this._parent = new Component(document.querySelector('.modal__window'));
    }

    public render(): void {
        this._parent.el.innerHTML = this._template(signinFormConfig);

        this._signinForm = new SigninForm(this._parent.el.getElementsByTagName('form')[0]);

        this._signinForm.usernameField.onInput(() => {
            this._signinForm.validateUsername();
        });

        this._signinForm.onSubmit((event) => {
            event.preventDefault();

            const username = this._signinForm.usernameField.getValue();
            const password = this._signinForm.passwordField.getValue();

            if (this._signinForm.validate()) {

                UserService.auth(username, password)
                    .then(() => {
                        EventBus.publish(events.closeModal, '');
                    })
                    .catch((err) => {

                        if (err.username) {
                            this._signinForm.usernameField.setError(ValidationError.notExistError());
                        }

                        if (err.password) {
                            this._signinForm.passwordField.setError(ValidationError.invalidPasswordError());
                        }
                    });
            }
        });
    }

    public clear(): void {
        this._parent.el.innerHTML = '';
        this._signinForm = null;
    }
}

export default SigninView;