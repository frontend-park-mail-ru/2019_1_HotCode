'use strict';

class Message {

    private textField: string;

    public static accessError(): string {
        return 'You are not authorized. Please login';
    }

    public static emptyFormError(): string {
        return 'You have not changed data';
    }

    public static fileFormatError(): string {
        return 'Incorrect data transfer format. The following formats are allowed: png, jpg, gif';
    }

    public static successfulUpdate(): string {
        return 'Your data has been successfully updated.';
    }

    public static successfulSendBot(): string {
        return 'Your bot has been successfully sent. Wait for confirmation of testing.';
    }

    public static successCopyKey(): string {
        return 'Your key successfully copied.';
    }

    public static codeTaken(): string {
        return 'This bot has already been sent. Try something else';
    }

    constructor(text: string) {
        this.textField = text;
    }

    get text() {
        return this.textField;
    }

    set text(value) {
        this.textField = value;
    }
}

export default Message;