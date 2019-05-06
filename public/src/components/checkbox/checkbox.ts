'use strict';

import InputComponent from "../baseComponent/inputComponent";
import {events} from '../../modules/utils/events';
import EventBus from '../../modules/event-bus';

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

        EventBus.subscribe(`onClose_${this.getId()}`, () => {

            this.emitCancel();
        });
    }

    get callbackOnCancel() {
        return this.callbackOnCancelField;
    }

    set callbackOnCancel(value) {
        this.callbackOnCancelField = value;
    }

    public isChecked(): boolean {
        return (this.el as HTMLInputElement).checked;
    }

    public emitCheck(): void {
        super.emit();

        if (!this.isChecked()) {
            (this.el as HTMLInputElement).checked = true;
        }
    }

    public emitCancel(): void {
        this.callbackOnCancel();

        if (this.isChecked()) {
            (this.el as HTMLInputElement).checked = false;
        }
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