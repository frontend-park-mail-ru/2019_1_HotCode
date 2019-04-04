'use strict';

class Game {

    private titleField: string;
    private slugField: string;
    private backgrondUUIDField: string;
    private logoUUIDField: string;
    private descriptionField: string;
    private rulesField: string;
    private codeExampleField: string;

    constructor() {
        this.titleField = '';
        this.slugField = '';
    }

    get title() {
        return this.titleField;
    }

    set title(value) {
        this.titleField = value;
    }

    get slug() {
        return this.slugField;
    }

    set slug(value) {
        this.slugField = value;
    }

    get backgrondUUID(): string {
        return this.backgrondUUIDField;
    }

    set backgrondUUID(value: string) {
        this.backgrondUUIDField = value;
    }

    get logoUUID(): string {
        return this.logoUUIDField;
    }

    set logoUUID(value: string) {
        this.logoUUIDField = value;
    }

    get description(): string {
        return this.descriptionField;
    }

    set description(value: string) {
        this.descriptionField = value;
    }

    get rules(): string {
        return this.rulesField;
    }

    set rules(value: string) {
        this.rulesField = value;
    }

    get codeExample(): string {
        return this.codeExampleField;
    }

    set codeExample(value: string) {
        this.codeExampleField = value;
    }

    public clearData(): void {
        this.titleField = '';
        this.slugField = '';
    }
}

export  default new Game();