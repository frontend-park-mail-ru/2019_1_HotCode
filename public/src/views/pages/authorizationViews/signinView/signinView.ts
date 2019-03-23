'use strict';

import Component from "../../../../components/baseComponent/index";
import UserService from "../../../../services/user-service";
import SigninForm from "../../../../components/form/signinForm";
import EventBus from "../../../../modules/event-bus";
import ValidationError from "../../../../components/form/utils/validationError";
import {signinFormConfig} from '../utils/formConfig';
import {events} from '../../../../modules/utils/events';
import Page from '../../page';

class SigninView extends Page {

    private static template = require('../formBaseView.pug');

    private _signinForm: SigninForm;

    constructor(parent: Component) {
        super(parent, 'SignIn - WarScript');
    }

    public render(): void {
        super.render();
        this.renderTmpl(SigninView.template, signinFormConfig);

        this._signinForm = new SigninForm(this.parent.el.getElementsByTagName('form')[0]);

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
        this.parent.el.innerHTML = '';
        this._signinForm = null;
        console.log('login CLEAR');
    }
}

export default SigninView;