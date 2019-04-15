'use strict';

import Form from "./form";
import CodeEditor from '../editor/codeEditor';

/**
 * TestCodeForm Component for TestCodeForm
 * @extends {Form}
 */
class TestCodeForm extends Form{

    private codeField: CodeEditor;

    constructor(el: HTMLElement) {
        super(el);

        this.codeField = new CodeEditor(this.el.querySelector('.play__item__content_theme_editor'));
    }

    get code(): CodeEditor {
        return this.codeField;
    }


    public validate(): boolean {
        return true;
    }
}

export default TestCodeForm;