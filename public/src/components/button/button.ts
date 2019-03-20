'use strict';

import InputComponent from "../baseComponent/inputComponent";

/**
 * Button Component for buttons
 * @extends {InputComponent}
 */
class Button extends InputComponent{

    constructor(el: HTMLElement, callback = () => {}) {
        super(el, callback);
    }

    public onClick(): void {
        this.on('click', this.callback);
    }
}

export default Button;