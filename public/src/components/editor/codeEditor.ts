'use strict';

import Component from '../baseComponent/index';
import {edit} from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

class CodeEditor extends Component{

    private editor: any;

    private inputTextField: Component;

    constructor(el: HTMLElement) {
        super(el);

        this.editor = edit(this.el);
        this.inputTextField = new Component(this.el.querySelector('.ace_text-input'));
    }

    public save(gameSlug: string): void {

        this.inputTextField.on('blur', () => {

            localStorage.setItem(`saveCode${gameSlug}`, this.getValue());
        });
    }

    public disable(): void {

        (this.inputTextField.el as HTMLInputElement).disabled = true;
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