'use strict';

class Game {
    constructor() {
        this._name = '';
        this._id = '';
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    clearData() {
        this._name = '';
        this._id = '';
    }
}

export  default new Game();