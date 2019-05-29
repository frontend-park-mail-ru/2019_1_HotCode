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
            this.el.querySelector('.field__main__error'));

        this.virginityField = true;


        this.crapLabel();


        if (this.input.el) {
            this.input.on('focus', () => {

                this.elField.classList.add('field_theme_filled');
                this.placeholderAnimationIn(true);

                this.virginityField = false
            });

            this.input.on('blur', () => {

                if(!this.getValue().length) {

                    this.elField.classList.remove('field_theme_filled');
                    this.placeholderAnimationIn(false);
                }
            });
        }

        if (this.input.el && (this.input.el as HTMLInputElement).type === 'password') {

            this.showPasswordCheckbox = new Checkbox(this.el.querySelector('input[type="checkbox"]'),
                () => {

                    this.openEye();
                    (this.input.el as HTMLInputElement).type = 'text';
                },
                () => {

                    this.closeEye();
                    (this.input.el as HTMLInputElement).type = 'password';
                });
            this.showPasswordCheckbox.onChange();
        }
    }

    get virginity(): boolean {
        return this.virginityField;
    }

    public focus(): void {

        if (this.input.el) {
            this.input.el.focus();
        }
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
            this.elField.classList.add('field_theme_filled');
            this.placeholderAnimationIn(true);
            (this.input.el as HTMLInputElement).value = value;
        }
    }

    public clearValue(): void {
        if (this.input.el) {
            (this.input.el as HTMLInputElement).value = '';
            this.elField.classList.remove('field_theme_filled');
            this.placeholderAnimationIn(false);
        }
    }

    public setError(errorText: string): void {
        if (this.errorField.el) {
            this.errorField.setTextAnim(errorText);
        }
    }

    public clearError(): void {
        if (this.errorField.el) {
            this.errorField.el.innerHTML = '';
        }
    }

    // false - валидное поле; true - ошибка
    public getErrorStatus(): boolean {
        if (this.errorField.el) {
            return !!this.errorField.el.innerHTML;
        }
        return false;
    }

    private crapLabel(): void {
        const placeholder = this.label.el.querySelector('.field__main__label__text');

        let value = placeholder.textContent,
            html = '';
        for(let w of value){
            if(w === ' ') w = '&nbsp;';
            html += `<span class="field__main__label__text__letter">${w}</span>`;
        }
        placeholder.innerHTML = html;
    }

    private placeholderAnimationIn(action: boolean){

        let letters = Array.from(this.elField.querySelectorAll('.field__main__label__text__letter'))
            .map((item) => item as HTMLElement);

        if(!action) letters = letters.reverse();

        letters.forEach((el, i) => {
            setTimeout(() => {
                let contains = this.elField.classList.contains('field_theme_filled');

                if( (action && !contains) || (!action && contains)) return;

                if (action) {

                    el.classList.add('field__main__label__text__letter_theme_active');
                    return;

                }

                el.classList.remove('field__main__label__text__letter_theme_active');
            }, (50 * i));
        });
    }

    private openEye(): void {

        const center = new Component(this.el.querySelector('.eye-icon__center'));
        const top = new Component(this.el.querySelector('.eye-icon__top'));

        center.removeClass('eye-icon__center_theme_close');
        top.removeClass('eye-icon__top_theme_close');
        center.addClass('eye-icon__center_theme_open');
        top.addClass('eye-icon__top_theme_open');
    }

    private closeEye(): void {

        const center = new Component(this.el.querySelector('.eye-icon__center'));
        const top = new Component(this.el.querySelector('.eye-icon__top'));

        center.removeClass('eye-icon__center_theme_open');
        top.removeClass('eye-icon__top_theme_open');
        center.addClass('eye-icon__center_theme_close');
        top.addClass('eye-icon__top_theme_close');
    }
}

export default Field;