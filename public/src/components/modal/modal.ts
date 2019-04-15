'use strict';

import Component from '../baseComponent/index';

class Modal extends Component {

    private static template = require('./modal.pug');

    private contentField: Component;
    private closeId: string;

    constructor(el: HTMLElement, closeId: string) {
        super(el);

        this.closeId = closeId;
    }

    get content(): Component {
        return this.contentField;
    }

    set content(value: Component) {
        this.contentField = value;
    }

    public render(): void {
        this.el.innerHTML = Modal.template({
            closeId: this.closeId,
        });

        this.contentField.el = this.el.querySelector('.modal-content');
        this.contentField.render();
    }

    public clear(): void {
        super.clear();
        this.contentField.clear();
    }
}

export default Modal;