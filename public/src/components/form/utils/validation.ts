'use strict';

import UserService from "../../../services/user-service";
import ValidationError from "./validationError";

class Validation {

    public static validateUsername(username: string, isLogin = false): void {
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

    public static validateUsernameOnUnique(username: string): Promise<any> {
        return new Promise((resolve, reject) => {

            try {
                Validation.validateUsername(username);
            } catch (usernameError) {
                reject(usernameError);
                return;
            }

            UserService.isTaken(username)
                .then((resp) => {

                    if (resp.used) {
                        reject(new ValidationError(ValidationError.uniqueError()));
                        return;
                    }
                    resolve();
                });
        });
    }

    public static validatePassword(password: string): void {
        if (password.length === 0) {
            throw new ValidationError(ValidationError.emptyFieldError());
        }

        const minLength = 0;
        if (password.length > 0 &&
            password.length < minLength) {
            throw new ValidationError(ValidationError.lengthError(minLength));
        }
    }

    public static validatePasswordEquality(password: string, passwordRepeat: string): void {

        if (password !== passwordRepeat) {
            throw new ValidationError(ValidationError.passwordEqualityError());
        }
    }
}

export default Validation;