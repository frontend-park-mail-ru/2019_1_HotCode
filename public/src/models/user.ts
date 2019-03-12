'use strict';

class User {

    private _username: string;
    private _id: string;
    private _active: boolean;
    private _avatar: string;

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

    public setData(username: string, id = '', active = false): void {
        this._username = username;
        this._id = id;
        this._active = active;
    }

    public clearData(): void {
        this._username = '';
        this._id = '';
        this._active = false;
    }
}

export  default new User();