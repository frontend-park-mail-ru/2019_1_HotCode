'use strict';

import InputComponent from "../baseComponent/inputComponent";

/**
 * Checkbox Component for checkbox
 * @extends {InputComponent}
 */
class Checkbox extends InputComponent{
    constructor(el, callbackOnCheck = () => {}, callbackOnCancel = () => {}) {
        super(el, callbackOnCheck);
        this._callbackOnCancel = callbackOnCancel;
    }

    get callbackOnCancel() {
        return this._callbackOnCancel;
    }

    set callbackOnCancel(value) {
        this._callbackOnCancel = value;
    }

    onChange() {
        this.on('change', (event) => {
            if (event.target.checked) {
                this._callback();
            } else {
                this._callbackOnCancel();
            }
        });
    }

}

export default Checkbox;