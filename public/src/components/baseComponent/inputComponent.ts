'use strict';

import Component from './index';
import EventBus from '../../modules/event-bus';

/**
 * InputComponent Component for InputComponent
 * @extends {Component}
 */
abstract class InputComponent extends Component{

    private callbackField: (param?: any) => any;

    constructor(el: HTMLElement, callback: () => void) {
        super(el);

        callback = callback ? callback : () => {
            return;
        };

        this.callbackField = callback;

        EventBus.subscribe(`${this.getId()}`, () => {
            this.emit();
        });
    }

    get callback() {
        return this.callbackField;
    }

    set callback(callback) {
        this.callbackField = callback;
    }

    public emit(): any {
        return this.callbackField();
    }

    public getId(): string{
        return this.el.id;
    }

    public hideAllReferences(): void {
        Array.from(document.querySelectorAll(`label[for=${this.getId()}]`))
            .map((reference) => (new Component(reference as HTMLElement)).hide());
    }

    public showAllReferences(): void {
        Array.from(document.querySelectorAll(`label[for=${this.getId()}]`))
            .map((reference) => (new Component(reference as HTMLElement)).show());
    }

    public clearAllReferences(): void {
        Array.from(document.querySelectorAll(`label[for=${this.getId()}]`))
            .map((reference) => (new Component(reference as HTMLElement)).clear());
    }

}

export default InputComponent;