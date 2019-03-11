'use strict';

import UserService from "../../../services/user-service";
import ValidationError from "./validationError";

class Validation {

    static validateUsername(username, isLogin = false) {
        return new Promise((resolve, reject) => {
            if (username.length === 0) {
                reject(new ValidationError(ValidationError.emptyFieldError()));
            }

            if (!isLogin) {

                const minLength = 4;
                if (username.length < minLength) {
                    reject(new ValidationError(ValidationError.lengthError(minLength)));
                }

                UserService.isTaken(username)
                    .then(resp => {
                        if (resp.used) {
                            reject(new ValidationError(ValidationError.uniqueError()));
                        } else {
                            resolve();
                        }
                    });
            } else {
                resolve();
            }
        });
    }

    static validatePassword(password) {
        const minLength = 0;
        if (password.length > 0 &&
            password.length < minLength) {
            throw new ValidationError(ValidationError.lengthError(minLength));
        }
    }

    static validatePasswordEquality(password, passwordRepeat) {
        try {
            Validation.validatePassword(password);
        } catch (passwordError) {
            throw passwordError;
        }

        if (password !== passwordRepeat) {
            throw new ValidationError(ValidationError.passwordEqualityError());
        }
    }
}

export default Validation