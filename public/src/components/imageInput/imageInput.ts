'use strict';

import InputComponent from "../baseComponent/inputComponent";

/**
 * ImageInput Component for imageInput
 * @extends {InputComponent}
 */
class ImageInput extends InputComponent{
    constructor(el: HTMLElement, callback: (param?: any) => void) {
        callback = callback ? callback : () => {
            return;
        };

        super(el, callback);
    }

    public getFile(): File {
        return (this.el as HTMLInputElement).files[0];
    }

    public onChange(): void {
        this.on('change', this.callback);
    }
}

export default ImageInput;