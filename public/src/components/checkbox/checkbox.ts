'use strict';

import InputComponent from "../baseComponent/inputComponent";

/**
 * Checkbox Component for checkbox
 * @extends {InputComponent}
 */
class Checkbox extends InputComponent{

    private _callbackOnCancel: (param?: any) => any;

    constructor(el: HTMLElement,
                callbackOnCheck = () => {},
                callbackOnCancel = () => {})
    {
        super(el, callbackOnCheck);
        this._callbackOnCancel = callbackOnCancel;
    }

    get callbackOnCancel() {
        return this._callbackOnCancel;
    }

    set callbackOnCancel(value) {
        this._callbackOnCancel = value;
    }

    public onChange(): void {
        this.on('change', (event) => {

            if ((<HTMLInputElement>event.target).checked) {
                return this.callback();
            }

            return this._callbackOnCancel();
        });
    }
}

export default Checkbox;