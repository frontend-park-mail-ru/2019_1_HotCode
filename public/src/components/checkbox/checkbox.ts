'use strict';

import InputComponent from "../baseComponent/inputComponent";

/**
 * Checkbox Component for checkbox
 * @extends {InputComponent}
 */
class Checkbox extends InputComponent{

    private callbackOnCancelField: (param?: any) => any;

    constructor(el: HTMLElement,
                callbackOnCheck: () => void,
                callbackOnCancel: () => void)
    {
        callbackOnCheck = callbackOnCheck ? callbackOnCheck : () => {
            return;
        };

        callbackOnCancel = callbackOnCancel ? callbackOnCancel : () => {
            return;
        };

        super(el, callbackOnCheck);
        this.callbackOnCancelField = callbackOnCancel;
    }

    get callbackOnCancel() {
        return this.callbackOnCancelField;
    }

    set callbackOnCancel(value) {
        this.callbackOnCancelField = value;
    }

    public onChange(): void {
        this.on('change', (event) => {

            if ((event.target as HTMLInputElement).checked) {
                return this.callback();
            }

            return this.callbackOnCancelField();
        });
    }
}

export default Checkbox;