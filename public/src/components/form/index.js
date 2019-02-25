'use strict';

import Component from '../component/index.js';

class Form extends Component{
    constructor(fields) {
        const el = document.createElement('form');
        super(el);

        fields.forEach(function (field) {
            const f = Component.Create('input', field.classes, field.attrs);
            this.append(f);
        }.bind(this));
    }
}

export default Form;