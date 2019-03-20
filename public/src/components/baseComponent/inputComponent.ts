'use strict';

import Component from './index';
import EventBus from '../../modules/event-bus';

/**
 * InputComponent Component for InputComponent
 * @extends {Component}
 */
abstract class InputComponent extends Component{

    private _callback: (param?: any) => any;

    constructor(el: HTMLElement, callback = () => {}) {
        super(el);

        this._callback = callback;

        EventBus.subscribe(`${this.getId()}`, () => {
            this.emit();
        });
    }

    get callback() {
        return this._callback;
    }

    set callback(callback) {
        this._callback = callback;
    }

    public emit(): any {
        return this._callback();
    }

    public getId(): string{
        return this.el.id;
    }

    public hideAllReferences(): void {
        Array.from(document.querySelectorAll(`label[for=${this.getId()}]`))
            .map(reference => (new Component(<HTMLElement>reference)).hide());
    }

    public showAllReferences(): void {
        Array.from(document.querySelectorAll(`label[for=${this.getId()}]`))
            .map(reference => (new Component(<HTMLElement>reference)).show());
    }

}

export default InputComponent;