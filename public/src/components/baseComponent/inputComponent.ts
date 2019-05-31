'use strict';

import Component from './index';
import EventBus from '../../modules/event-bus';

/**
 * InputComponent Component for InputComponent
 * @extends {Component}
 */
abstract class InputComponent extends Component{

    private callbackField: (param?: any) => any;
    private onCallback: {[key: string]: () => void};

    constructor(el: HTMLElement, callback: () => void) {
        super(el);

        callback = callback ? callback : () => {
            return;
        };

        this.callbackField = callback;

        this.onCallback = EventBus.subscribe(`${this.getId()}`, (param?: any) => {
            this.emit(param);
        });
    }

    get callback() {
        return this.callbackField;
    }

    set callback(callback) {
        this.callbackField = callback;
    }

    public emit(param?: any): any {
        return this.callbackField(param);
    }

    public getId(): string{
        return this.el.id;
    }

    public stop(): void {

        this.onCallback.unsubscribe();
        this.onCallback = null;
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