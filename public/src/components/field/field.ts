'use strict';

import Component from '../baseComponent/index';
import Checkbox from '../checkbox/checkbox';

/**
 * Field Component for inputs
 * @extends {Component}
 */
class Field extends Component{

    private input: Component;
    private label: Component;
    private errorField: Component;

    private virginityField: boolean;

    private showPasswordCheckbox: Checkbox;

    constructor(el: HTMLElement,
                input?: HTMLElement,
                label?: HTMLElement,
                errorField?: HTMLElement)
    {
        super(el);

        this.input = new Component(input ||
            this.el.querySelector('.field__main__input'));

        this.label = new Component(label ||
            this.el.querySelector('.field__main__label'));

        this.errorField = new Component(errorField ||
            this.el.querySelector('.field__header__error'));

        this.virginityField = true;

        if (this.input.el) {
            this.input.on('focus', () => this.virginityField = false);
        }

        if (this.input.el && (this.input.el as HTMLInputElement).type === 'password') {
            this.showPasswordCheckbox = new Checkbox(this.el.querySelector('input[type="checkbox"]'),
                () => {
                    (this.input.el as HTMLInputElement).type = 'text';
                },
                () => {
                    (this.input.el as HTMLInputElement).type = 'password';
                });
            this.showPasswordCheckbox.onChange();
        }
    }

    get virginity(): boolean {
        return this.virginityField;
    }

    public onFocus(callback: () => void): void {
        if (this.input.el) {
            this.input.on('focus', callback);
        }
    }

    public onInput(callback: () => void): void {
        if (this.input.el) {
            this.input.on('input', callback);
        }
    }

    public onBlur(callback: () => void): void {
        if (this.input.el) {
            this.input.on('blur', callback);
        }
    }

    public getValue(): string {
        if (this.input.el) {
            return (this.input.el as HTMLInputElement).value;
        }
    }

    public setValue(value: string): void {
        if (this.input.el) {
            (this.input.el as HTMLInputElement).value = value;
        }
    }

    public clearValue(): void {
        if (this.input.el) {
            (this.input.el as HTMLInputElement).value = '';
        }
    }

    public setError(errorText: string): void {
        if (this.errorField.el) {
            this.errorField.setText(errorText);
        }
    }

    public clearError(): void {
        if (this.errorField.el) {
            this.errorField.setText('');
        }
    }

    // false - валидное поле; true - ошибка
    public getErrorStatus(): boolean {
        if (this.errorField.el) {
            return !!this.errorField.el.innerText;
        }
        return false;
    }
}

export default Field;