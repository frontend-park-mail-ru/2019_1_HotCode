'use strict';

import Form from "./form";
import Field from "../field/field";

/**
 * TestCodeForm Component for TestCodeForm
 * @extends {Form}
 */
class TestCodeForm extends Form{

    private _codeField: Field;

    constructor(el: HTMLElement) {
        super(el);

        this._codeField = new Field(this.el.querySelector('.play__textarea__for__code'),
                                    this.el.querySelector('.play__textarea__for__code'), null, null);
    }

    get codeField(): Field {
        return this._codeField;
    }


    public validate(): boolean {
        return !this._codeField.getErrorStatus();
    }
}

export default TestCodeForm;