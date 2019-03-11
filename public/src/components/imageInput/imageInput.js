'use strict';

import InputComponent from "../baseComponent/inputComponent";

/**
 * ImageInput Component for imageInput
 * @extends {InputComponent}
 */
class ImageInput extends InputComponent{
    constructor(el, callback = () => {}) {
        super(el, callback);
    }

    getFile() {
        return this.el.files[0];
    }

    onChange() {
        this.on('change', this.callback);
    }
}

export default ImageInput;