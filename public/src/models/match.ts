'use strict';

import EventBus from '../modules/event-bus';
import {events} from '../modules/utils/events';

class Match {

    private idField: number;
    private resultField: number;
    private user1Field: {[key: string]: string};
    private user2Field: {[key: string]: string};
    private replayField: any;
    private diff1Field: number;
    private diff2Field: number;
    private dateField: string;
    private codeField: string;

    constructor() {}


    get id(): number {
        return this.idField;
    }

    set id(value: number) {
        this.idField = value;
    }

    get result(): number {
        return this.resultField;
    }

    set result(value: number) {
        this.resultField = value;
    }

    get user1(): { [p: string]: string } {
        return this.user1Field;
    }

    set user1(value: { [p: string]: string }) {
        this.user1Field = value;
    }

    get user2(): { [p: string]: string } {
        return this.user2Field;
    }

    set user2(value: { [p: string]: string }) {
        this.user2Field = value;
    }

    get replay(): any {
        return this.replayField;
    }

    set replay(value: any) {
        this.replayField = value;
    }

    get diff1(): number {
        return this.diff1Field;
    }

    set diff1(value: number) {
        this.diff1Field = value;
    }

    get diff2(): number {
        return this.diff2Field;
    }

    set diff2(value: number) {
        this.diff2Field = value;
    }

    get date(): string {
        return this.dateField;
    }

    set date(value: string) {
        this.dateField = value;
    }

    get code(): string {
        return this.codeField;
    }

    set code(value: string) {
        this.codeField = value;
    }

    public clearData(): void {
        this.idField = null;
        this.resultField = null;
        this.user1Field = null;
        this.user2Field = null;
        this.diff1Field = null;
        this.diff2Field = null;
        this.codeField = null;
        this.replayField = null;
        this.dateField = null;
    }
}

export  default new Match();