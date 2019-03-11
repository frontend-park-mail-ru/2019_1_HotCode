'use strict';

class User {
    constructor() {
        this._username = '';
        this._id = '';
        this._active = false;
        this._avatar = '';
    }

    get username() {
        return this._username;
    }

    set username(value) {
        this._username = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get active() {
        return this._active;
    }

    set active(value) {
        this._active = value;
    }

    get avatar() {
        return this._avatar;
    }

    set avatar(value) {
        this._avatar = value;
    }

    setData(username, id = '', active = false) {
        this._username = username;
        this._id = id;
        this._active = active;
    }

    clearData() {
        this._username = '';
        this._id = '';
        this._active = false;
    }
}

export  default new User();