'use strict';

import Component from "../../../components/baseComponent/index";
import Tabbar from "../../../components/tabbar/tabbar";
import Game from "../../../models/game";
import Parallax from '../../../modules/parallax';
import Layer from '../layer';
import ViewService from '../../../services/view-service';

class GameMenuLayer extends Layer {

    private static template = require('./gameMenuLayer.pug');

    private gameContainer: Component;
    private gameImageLogo: Component;
    private gameContent: Component;

    private optionsTabbar: Tabbar;

    constructor(parent: Component) {
        super(parent);
    }

    public render(): void {
        this.renderTmpl(GameMenuLayer.template, {title: Game.title,
            backgroundUUID: Game.backgrondUUID,
            logoUUID: Game.logoUUID,
        });

        const parallax = new Parallax(new Component(this.parent.el.querySelector('.background_theme_gamemenu-img')),
            100,
            80);
        parallax.onMouseMove();
        parallax.moveBackground();

        this.gameContainer = new Component(this.parent.el.querySelector('.container_theme_game-menu'));
        this.gameImageLogo = new Component(this.parent.el.querySelector('.game-menu__main__content-right'));
        this.gameContent = new Component(this.parent.el.querySelector('.game-menu__main__content-left'));

        this.optionsTabbar = new Tabbar(this.parent.el.querySelector('.options__check'), {
            option0: () => {
                this.gameContainer.removeClass('container_theme_game-play');
                this.gameImageLogo.show();
                this.gameContent.removeClass('game-menu__main__content-left_theme_play');
                ViewService.goToGameDescriptionView();

            },
            option1: () => {
                this.gameContainer.removeClass('container_theme_game-play');
                this.gameImageLogo.show();
                this.gameContent.removeClass('game-menu__main__content-left_theme_play');
                ViewService.goToGameLiderBoardView();
            },
            option2: () => {
                this.gameContainer.addClass('container_theme_game-play');
                this.gameImageLogo.hide();
                this.gameContent.addClass('game-menu__main__content-left_theme_play');
                ViewService.goToGameView();
            },
        });

        this.optionsTabbar.onChange();
    }

    public clear(): void {
        this.parent.el.innerHTML = '';

        this.optionsTabbar = null;
        this.gameContainer = null;
        this.gameImageLogo = null;
        this.gameContent = null;
    }
}

export default GameMenuLayer;