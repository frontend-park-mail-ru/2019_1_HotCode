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
    private onCancelCallback: {[key: string]: () => void};
    private onStop: {[key: string]: () => void};

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

        this.onCancelCallback = EventBus.subscribe(`onClose_${this.getId()}`, () => {

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
        this.onStop = this.on('change', (event) => {

            if ((event.target as HTMLInputElement).checked) {
                return this.callback();
            }

            return this.callbackOnCancelField();
        });
    }

    public stop(): void {
        this.onStop.remover();
        super.stop();

        this.onCancelCallback.unsubscribe();
        this.onCancelCallback = null;
    }
}

export default Checkbox;