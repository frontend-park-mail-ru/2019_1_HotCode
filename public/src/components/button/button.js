'use strict';

import InputComponent from "../baseComponent/inputComponent";

/**
 * Button Component for buttons
 * @extends {InputComponent}
 */
class Button extends InputComponent{
    constructor(el, callback = () => {}) {
        super(el, callback);
    }

    onClick() {
        this.on('click', this.callback);
    }
}

export default Button;