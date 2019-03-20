'use strict';

class ValidationError {

    private _errorText: string;

    static emptyFieldError(): string {
        return 'fill_this_field';
    }

    static lengthError(minLenght: number): string {
        return `minimum_length_of_${minLenght}_characters`;
    }

    static uniqueError(): string {
        return 'this_name_is_already_taken';
    }

    static passwordEqualityError(): string {
        return 'passwords_do_not_match';
    }

    static notExistError(): string {
        return 'user_does_not_exist';
    }

    static invalidPasswordError(): string {
        return 'invalid_password';
    }

    constructor(errorText: string) {
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