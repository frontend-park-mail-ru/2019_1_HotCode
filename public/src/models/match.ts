'use strict';

import EventBus from '../modules/event-bus';
import {events} from '../modules/utils/events';

class Match {

    private idField: number;
    private resultField: number;
    private user1Field: {[key: string]: string};
    private user2Field: {[key: string]: string};
    private bot1_idField: number;
    private bot2_idField: number;
    private replayField: any;
    private logsField: any;
    private diff1Field: number;
    private diff2Field: number;
    private dateField: string;
    private codeField: string;
    private errorField: string;
    private gameSlugField: string;

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

    get bot1_id(): number {
        return this.bot1_idField;
    }

    set bot1_id(value: number) {
        this.bot1_idField = value;
    }

    get bot2_id(): number {
        return this.bot2_idField;
    }

    set bot2_id(value: number) {
        this.bot2_idField = value;
    }

    get replay(): any {
        return this.replayField;
    }

    set replay(value: any) {
        this.replayField = value;
    }

    get logs(): any {
        return this.logsField;
    }

    set logs(value: any) {
        this.logsField = value;
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

    get error(): string {
        return this.errorField;
    }

    set error(value: string) {
        this.errorField = value;
    }

    get gameSlug(): string {
        return this.gameSlugField;
    }

    set gameSlug(value: string) {
        this.gameSlugField = value;
    }

    public clearData(): void {
        this.idField = null;
        this.resultField = null;
        this.user1Field = null;
        this.user2Field = null;
        this.bot1_idField = null;
        this.bot2_idField = null;
        this.diff1Field = null;
        this.diff2Field = null;
        this.codeField = null;
        this.replayField = null;
        this.logsField = null;
        this.dateField = null;
        this.errorField = null;
        this.gameSlugField = null;
    }
}

export  default new Match();