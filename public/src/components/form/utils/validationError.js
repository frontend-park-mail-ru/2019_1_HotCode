'use strict';

class ValidationError {

    static emptyFieldError() {
        return 'Fill this field';
    }

    static lengthError(minLenght) {
        return `Minimum length of ${minLenght} characters`;
    }

    static uniqueError() {
        return 'This name is already taken';
    }

    static passwordEqualityError() {
        return 'Passwords do not match';
    }

    static loginError() {
        return 'Invalid username / password'
    }

    constructor(errorText) {
        this._errorText = errorText;
    }

    get errorText() {
        return this._errorText;
    }

    set errorText(value) {
        this._errorText = value;
    }
}

export default ValidationError