'use strict';

import Form from "./form";
import CodeEditor from '../editor/codeEditor';

/**
 * TestCodeForm Component for TestCodeForm
 * @extends {Form}
 */
class TestCodeForm extends Form{

    private _codeField: CodeEditor;

    constructor(el: HTMLElement) {
        super(el);

        this._codeField = new CodeEditor(this.el.querySelector('.play__editor'));
    }

    get codeField(): CodeEditor {
        return this._codeField;
    }


    public validate(): boolean {
        return true;
    }
}

export default TestCodeForm;