'use strict';

import Component from '../../../components/baseComponent/index';
import Layer from '../layer';
import ScrollableBlock from '../../../components/scrollable/scrollable';

class RootLayer extends Layer {

    constructor() {
        super(Component.Create('div', ['root']));
        document.body.insertBefore(this.parent.el, document.body.firstChild);
    }

    public render(): void {
        const rootContent = new ScrollableBlock(this.parent.el, true);
        rootContent.decorate();
    }

    public clear(): void {
        this.parent.el.innerHTML = '';
        console.log('root CLEAR');
    }
}

export default RootLayer;