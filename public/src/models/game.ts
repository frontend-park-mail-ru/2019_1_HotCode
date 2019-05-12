'use strict';

import EventBus from '../modules/event-bus';
import {events} from '../modules/utils/events';

class Game {

    private titleField: string;
    private slugField: string;
    private backgrondUUIDField: string;
    private logoUUIDField: string;
    private descriptionField: string;
    private rulesField: string;
    private codeExampleField: string;
    private botCodeField: string;

    constructor() {
        this.titleField = '';
        this.slugField = '';
    }

    get title() {
        return this.titleField;
    }

    set title(value) {
        this.titleField = value;
        EventBus.publish(events.onTitleChange);
    }

    get slug() {
        return this.slugField;
    }

    set slug(value) {
        this.slugField = value;
        EventBus.publish(events.onSlugChange);
    }

    get backgrondUUID(): string {
        return this.backgrondUUIDField;
    }

    set backgrondUUID(value: string) {
        this.backgrondUUIDField = value;
        EventBus.publish(events.onBackgroundChange);
    }

    get logoUUID(): string {
        return this.logoUUIDField;
    }

    set logoUUID(value: string) {
        this.logoUUIDField = value;
        EventBus.publish(events.onLogoChange);
    }

    get description(): string {
        return this.descriptionField;
    }

    set description(value: string) {
        this.descriptionField = value;
        EventBus.publish(events.onDescriptionChange);
    }

    get rules(): string {
        return this.rulesField;
    }

    set rules(value: string) {
        this.rulesField = value;
        EventBus.publish(events.onRulesChange);
    }

    get codeExample(): string {
        return this.codeExampleField;
    }

    set codeExample(value: string) {
        this.codeExampleField = value;
        EventBus.publish(events.onCodeChange);
    }

    get botCode(): string {
        return this.botCodeField;
    }

    set botCode(value: string) {
        this.botCodeField = value;
        EventBus.publish(events.onBotCodeChange);
    }

    public clearData(): void {
        this.titleField = '';
        this.slugField = '';
    }
}

export  default new Game();