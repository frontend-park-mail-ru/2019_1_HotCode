'use strict';

import Component from "../baseComponent";
import InputComponent from "../baseComponent/inputComponent";

class Tab extends InputComponent{
    constructor(el, callback = () => {}) {
        super(el, callback);
    }

    static createTab(id, classes = [], attrs = {}) {
        attrs['type'] = 'radio';
        attrs['id'] = id;
        const newTab = Component.Create('input', classes, attrs);

        return new Tab(newTab);
    }

    isChecked() {
        return this.el.checked;
    }

    emit() {
        super.emit();
        if (!this.isChecked()) {
            this.el.checked = true;
        }
    }
}

export default Tab;