'use strict';

import Component from '../baseComponent/index';

/**
 * Form Component for forms
 * @extends {Component}
 */
class Form extends Component{
    constructor(el: HTMLElement) {
        super(el);
    }

    public onSubmit(callback: (param?: any) => void): void {
        this.on('submit', callback);
    }
}

export default Form;