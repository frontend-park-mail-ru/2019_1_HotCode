'use strict';

import Layer from '../layer';
import Component from '../../../components/baseComponent/index';
import Parallax from '../../../modules/parallax';

class PopUpLayer extends Layer {

    private static template = require('./popUpLayer.pug');

    private popup: Component;

    constructor(parent: Component) {
        super(parent);
    }

    public render(): void {
        this.renderTmpl(PopUpLayer.template);

        this.popup = new Component(this.parent.el.querySelector('.container_theme_modal'));
        this.popup.el.style.animationName = 'vanish-in';

    }

    public clear(): void {
        this.parent.el.innerHTML = '';
        console.log('popup CLEAR');
    }
}

export default PopUpLayer;