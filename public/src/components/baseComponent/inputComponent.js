'use strict';

import Component from './index.js';
import EventBus from '../../modules/event-bus';

/**
 * InputComponent Component for InputComponent
 * @extends {Component}
 */
class InputComponent extends Component{
    constructor(el, callback = () => {}) {
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

    emit() {
        return this._callback();
    }

    getId() {
        return this.el.id;
    }

    hideAllReferences() {
        Array.from(document.querySelectorAll(`label[for=${this.getId()}]`))
            .map(reference => (new Component(reference)).hide());
    }

    showAllReferences() {
        Array.from(document.querySelectorAll(`label[for=${this.getId()}]`))
            .map(reference => (new Component(reference)).show());
    }

}

export default InputComponent;