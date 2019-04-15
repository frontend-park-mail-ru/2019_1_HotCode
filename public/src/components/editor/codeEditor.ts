'use strict';

import Component from '../baseComponent/index';
import {edit} from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

class CodeEditor extends Component{

    private editor: any;

    constructor(el: HTMLElement) {
        super(el);

        this.editor = edit(this.el);
    }

    public getValue(): string {
        return this.editor.getValue();
    }

    public setValue(value: string): void {
        this.editor.session.setValue(value);
    }

    public setTheme(theme: string): void {
        this.editor.setTheme(theme);
    }

    public setMode(mode: string): void {
        this.editor.session.setMode(mode);
    }

}

export default CodeEditor;