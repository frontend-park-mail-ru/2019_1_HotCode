'use strict';

import Component from "../../../../components/baseComponent/index";
import Page from '../../page';

class DescriptionPage extends Page{

    private static template = require('./descriptionPage.pug');

    constructor(parent: Component) {
        super(parent, 'Description - Game - WarScript');
    }

    public render(): void {
        super.render();
        this.renderTmpl(DescriptionPage.template);
    }



    public clear(): void {
        this.parent.el.innerHTML = '';
    }
}

export default DescriptionPage;