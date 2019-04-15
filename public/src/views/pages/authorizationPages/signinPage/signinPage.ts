'use strict';

import Component from "../../../../components/baseComponent/index";
import UserService from "../../../../services/user-service";
import SigninForm from "../../../../components/form/signinForm";
import EventBus from "../../../../modules/event-bus";
import ValidationError from "../../../../components/form/utils/validationError";
import {signinFormConfig} from '../utils/formConfig';
import {events} from '../../../../modules/utils/events';
import Page from '../../page';

class SigninPage extends Page {

    private static template = require('../formBasePage.pug');

    private signinForm: SigninForm;

    constructor(parent: Component) {
        super(parent, 'SignIn - WarScript');
    }

    public render(): void {
        super.render();
        this.renderTmpl(SigninPage.template, signinFormConfig);

        this.signinForm = new SigninForm(this.parent.el.querySelector('.form_theme_popup'));

        this.signinForm.usernameField.onInput(() => {
            this.signinForm.validateUsername();
        });

        this.signinForm.onSubmit((event) => {
            event.preventDefault();

            const username = this.signinForm.usernameField.getValue();
            const password = this.signinForm.passwordField.getValue();

            if (this.signinForm.validate()) {

                UserService.auth(username, password)
                    .then(() => {
                        EventBus.publish(events.closeModal, '');
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

    public clear(): void {
        this.parent.el.innerHTML = '';
        this.signinForm = null;
        console.log('login CLEAR');
    }
}

export default SigninPage;