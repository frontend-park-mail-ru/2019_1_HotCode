'use strict';

import Component from "../../../../components/baseComponent/index";
import Page from '../../page';
import Game from "../../../../models/game";

class DescriptionPage extends Page{

    private static template = require('./descriptionPage.pug');

    constructor(parent: Component) {
        super(parent, 'Description - Game - WarScript');
    }

    public render(): void {
        super.render();
        this.renderTmpl(DescriptionPage.template, {descripton: Game.description});
    }



    public clear(): void {
        this.parent.el.innerHTML = '';
    }
}

export default DescriptionPage;