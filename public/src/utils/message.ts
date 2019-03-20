'use strict';

class Message {

    private _text: string;

    static accessError(): string {
        return 'You are not authorized. Please login';
    }

    static emptyFormError(): string {
        return 'You have not changed data';
    }

    static fileFormatError(): string {
        return 'Incorrect data transfer format. The following formats are allowed: png, jpg, gif';
    }

    static successfulUpdate(): string {
        return 'Your data has been successfully updated.';
    }

    constructor(text: string) {
        this._text = text;
    }

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
    }
}

export default Message