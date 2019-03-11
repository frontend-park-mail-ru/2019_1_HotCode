'use strict';

import UserService from "../../../services/user-service";
import ValidationError from "./validationError";

class Validation {

    static validateUsername(username, isLogin = false) {
        if (username.length === 0) {
            throw new ValidationError(ValidationError.emptyFieldError());
        }

        if (!isLogin) {

            const minLength = 0;
            if (username.length < minLength) {
                throw new ValidationError(ValidationError.lengthError(minLength));
            }

        }
    }

    static validateUsernameOnUnique(username) {
        return new Promise((resolve, reject) => {

            try {
                Validation.validateUsername(username);
            } catch (usernameError) {
                reject(usernameError);
                return;
            }

            UserService.isTaken(username)
                .then(resp => {
                    if (resp.used) {
                        reject(new ValidationError(ValidationError.uniqueError()));
                    } else {
                        resolve();
                    }
                });
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