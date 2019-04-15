'use strict';

import InputComponent from "../baseComponent/inputComponent";

class Tab extends InputComponent {

    constructor(el: HTMLElement, callback?: () => void ) {

        callback = callback ? callback : () => {
            return;
        };

        super(el, callback);
    }

    public isChecked(): boolean {
        return (this.el as HTMLInputElement).checked;
    }

    public emit(): void {
        super.emit();

        if (!this.isChecked()) {
            (this.el as HTMLInputElement).checked = true;
        }
    }
}

export default Tab;