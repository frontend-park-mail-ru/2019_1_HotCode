'use strict';

import Component from '../baseComponent/index';

/**
 * Form Component for forms
 * @extends {Component}
 */
abstract class Form extends Component{
    constructor(el: HTMLElement) {
        super(el);
    }

    public onSubmit(callback: (param?: any) => void): void {
        this.on('submit', callback);
    }

    public abstract validate(): boolean ;

}

export default Form;