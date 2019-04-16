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

        const gameContainer = new Component(document.querySelector('.container_theme_game-menu'));
        const gameImageLogo = new Component(document.querySelector('.game-menu__main__content-right'));
        const gameContent = new Component(document.querySelector('.game-menu__main__content-left'));

        gameContainer.removeClass('container_theme_game-play');
        gameImageLogo.show();
        gameContent.removeClass('game-menu__main__content-left_theme_play');
    }



    public clear(): void {
        this.parent.el.innerHTML = '';
    }
}

export default DescriptionPage;