'use strict';

import {events} from '../modules/utils/events';
import EventBus from '../modules/event-bus';

class User {

    private usernameField: string;
    private idField: string;
    private activeField: boolean;
    private avatarField: string;
    private keyField: string;

    constructor() {
        this.usernameField = '';
        this.idField = '';
        this.activeField = false;
        this.avatarField = '';
        this.keyField = '';
    }

    get username() {
        return this.usernameField;
    }

    set username(value) {
        this.usernameField = value;
        EventBus.publish(events.onUsernameChange);
    }

    get id() {
        return this.idField;
    }

    set id(value) {
        this.idField = value;
        EventBus.publish(events.onUserIDChange);
    }

    get active() {
        return this.activeField;
    }

    set active(value) {
        this.activeField = value;
    }

    get avatar() {
        return this.avatarField;
    }

    set avatar(value) {
        this.avatarField = value;
        EventBus.publish(events.onAvatarChange);
    }

    get key(): string {
        return this.keyField;
    }

    set key(value: string) {
        this.keyField = value;
        EventBus.publish(events.onVkKeyChange);
    }

    public setData(username: string, id = '', active = false): void {
        this.usernameField = username;
        this.idField = id;
        this.activeField = active;
    }

    public clearData(): void {
        this.usernameField = '';
        this.idField = '';
        this.activeField = false;
    }
}

export  default new User();