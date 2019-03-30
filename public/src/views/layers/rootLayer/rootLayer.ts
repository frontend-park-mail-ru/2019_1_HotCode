'use strict';

import Component from '../../../components/baseComponent/index';
import Layer from '../layer';

class RootLayer extends Layer {

    constructor() {
        super(Component.Create('div', ['root']));
        document.body.insertBefore(this.parent.el, document.body.firstChild);
    }

    public render(): void {
        return;
    }

    public clear(): void {
        this.parent.el.innerHTML = '';
        console.log('root CLEAR');
    }
}

export default RootLayer;