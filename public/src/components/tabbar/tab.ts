'use strict';

import InputComponent from "../baseComponent/inputComponent";

class Tab extends InputComponent{

    constructor(el: HTMLElement, callback = () => {}) {
        super(el, callback);
    }

    public isChecked(): boolean {
        return (<HTMLInputElement>this.el).checked;
    }

    public emit(): void {
        super.emit();
        if (!this.isChecked()) {
            (<HTMLInputElement>this.el).checked = true;
        }
    }
}

export default Tab;