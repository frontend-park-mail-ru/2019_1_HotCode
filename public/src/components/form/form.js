'use strict';

import Component from '../baseComponent/index.js';

/**
 * Form Component for forms
 * @extends {Component}
 */
class Form extends Component{
    constructor(el) {
        super(el);
    }

    onSubmit(callback) {
        this.on('submit', callback);
    }
}

export default Form;