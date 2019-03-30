'use strict';

import Layer from '../layer';
import Component from '../../../components/baseComponent/index';
import Parallax from '../../../modules/parallax';

class PopUpLayer extends Layer {

    private static template = require('./popUpLayer.pug');

    private popup: Component;
    private popupAnimateBlock: Component;

    constructor(parent: Component) {
        super(parent);
    }

    public render(): void {
        this.renderTmpl(PopUpLayer.template);

        this.popup = new Component(this.parent.el.querySelector('.modal'));
        this.popupAnimateBlock = new Component(this.parent.el.querySelector('.modal__vanishin'));

        this.popupAnimateBlock.addClass('magictime');

        const parallax = new Parallax(this.popup, -15, 15);
        parallax.onMouseMove();
        parallax.degBackground();

    }

    public clear(): void {
        this.parent.el.innerHTML = '';
        this.popup = null;
        this.popupAnimateBlock = null;
        console.log('popup CLEAR');
    }
}

export default PopUpLayer;