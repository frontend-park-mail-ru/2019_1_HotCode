'use strict';

import Component from '../baseComponent/index';

/**
 * Field Component for inputs
 * @extends {Component}
 */
class Field extends Component{

    private _input: Component;
    private _label: Component;
    private _errorField: Component;

    private _virginityField: boolean;

    constructor(el: HTMLElement,
                input?: HTMLElement,
                label?: HTMLElement,
                errorField?: HTMLElement)
    {
        super(el);

        this._input = new Component(input ||
            this.el.getElementsByTagName('input')[0]);

        this._label = new Component(label ||
            this.el.querySelector('.form__label'));

        this._errorField = new Component(errorField ||
            this.el.querySelector('.form__error'));

        this._virginityField = true;

        this._input.on('focus', () => this._virginityField = false );
    }

    get virginityField(): boolean {
        return this._virginityField;
    }

    public onFocus(callback: () => void): void {
        this._input.on('focus', callback);
    }

    public onInput(callback: () => void): void {
        this._input.on('input', callback);
    }

    public onBlur(callback: () => void): void {
        this._input.on('blur', callback);
    }

    public getValue(): string {
        return (<HTMLInputElement>this._input.el).value;
    }

    public setValue(value: string): void {
        (<HTMLInputElement>this._input.el).value = value;
    }

    public clearValue(): void {
        (<HTMLInputElement>this._input.el).value = '';
    }

    public setError(errorText: string): void {
        this._errorField.setText(errorText);
    }

    public clearError(): void {
        this._errorField.setText('');
    }

    // false - валидное поле; true - ошибка
    public getErrorStatus(): boolean {
        return !!this._errorField.el.innerText;
    }
}

export default Field;