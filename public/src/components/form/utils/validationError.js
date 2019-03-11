'use strict';

class ValidationError {

    static emptyFieldError() {
        return 'fill_this_field';
    }

    static lengthError(minLenght) {
        return `minimum_length_of_${minLenght}_characters`;
    }

    static uniqueError() {
        return 'this_name_is_already_taken';
    }

    static passwordEqualityError() {
        return 'passwords_do_not_match';
    }

    static notExistError() {
        return 'user_does_not_exist';
    }

    static invalidPasswordError() {
        return 'invalid_password';
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