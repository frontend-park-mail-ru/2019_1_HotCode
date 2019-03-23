'use strict';

import Component from "../../../../components/baseComponent/index";
import Page from '../../page';

class GamePage extends Page{

    private static template = require('./gamePage.pug');

    constructor(parent: Component) {
        super(parent, 'Game - WarScript');
    }

    public render(): void {
        super.render();
        this.renderTmpl(GamePage.template);
    }



    public clear(): void {
        this.parent.el.innerHTML = '';
    }
}

export default GamePage;