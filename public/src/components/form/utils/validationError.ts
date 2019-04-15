'use strict';

class ValidationError {

    private errorTextField: string;

    public static emptyFieldError(): string {
        return 'fill_this_field';
    }

    public static lengthError(minLenght: number): string {
        return `minimum_length_of_${minLenght}_characters`;
    }

    public static uniqueError(): string {
        return 'this_name_is_already_taken';
    }

    public static passwordEqualityError(): string {
        return 'passwords_do_not_match';
    }

    public static notExistError(): string {
        return 'user_does_not_exist';
    }

    public static invalidPasswordError(): string {
        return 'invalid_password';
    }

    constructor(errorText: string) {
        this.errorTextField = errorText;
    }

    get errorText() {
        return this.errorTextField;
    }

    set errorText(value) {
        this.errorTextField = value;
    }
}

export default ValidationError;