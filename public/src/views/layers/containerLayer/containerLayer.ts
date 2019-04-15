'use strict';

import Component from '../../../components/baseComponent/index';
import Layer from '../layer';

class ContainerLayer extends Layer{

    private static template = require('./containerLayer.pug');

    private container: Component;

    constructor(parent: Component) {
        super(parent);
    }

    public render(): void {
        this.renderTmplBesideHTML(ContainerLayer.template);

        this.container = new Component(this.parent.el.querySelector('.base-container_theme_main'));
    }

    public clear() {
        this.container.clear();
        this.container = null;

        console.log('container CLEAR');
    }
}

export default ContainerLayer;