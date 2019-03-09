'use strict';

import Component from '../baseComponent/index.js';

/**
 * Field Component for inputs
 * @extends {Component}
 */
class Field extends Component{
    constructor(el, input, label, errorField) {
        super(el);

        this.input = new Component(input ||
            this.el.querySelector('input'));

        this.label = new Component(label ||
            this.el.querySelector('.form__label'));

        this.errorField = new Component(errorField ||
            this.el.querySelector('.form__error'));
    }

    onFocus(callback) {
        this.input.on('focus', callback);
    }

    onBlur(callback) {
        this.input.on('blur', callback);
    }

    getValue() {
        return this.input.el.value;
    }

    setValue(value) {
        return this.input.el.value = value;
    }

    setError(errorText) {
        this.errorField.setText(errorText);
    }

    clearError() {
        this.errorField.setText('');
    }

    // false - валидное поле; true - ошибка
    getErrorStatus() {
        return !!this.errorField.el.innerText;
    }
}

export default Field;