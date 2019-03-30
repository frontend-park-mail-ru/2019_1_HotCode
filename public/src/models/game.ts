'use strict';

class Game {

    private nameField: string;
    private idField: string;

    constructor() {
        this.nameField = '';
        this.idField = '';
    }

    get name() {
        return this.nameField;
    }

    set name(value) {
        this.nameField = value;
    }

    get id() {
        return this.idField;
    }

    set id(value) {
        this.idField = value;
    }

    public clearData(): void {
        this.nameField = '';
        this.idField = '';
    }
}

export  default new Game();