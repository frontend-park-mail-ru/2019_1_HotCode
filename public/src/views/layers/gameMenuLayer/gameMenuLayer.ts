'use strict';

import Component from "../../../components/baseComponent/index";
import Tabbar from "../../../components/tabbar/tabbar";
import Game from "../../../models/game";
import Parallax from '../../../modules/parallax';
import Layer from '../layer';
import ViewService from '../../../services/view-service';

class GameMenuLayer extends Layer {

    private static template = require('./gameMenuLayer.pug');

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

        this.optionsTabbar = new Tabbar(this.parent.el.querySelector('.options__check'), {
            option0: () => {
                ViewService.goToGameDescriptionView();

            },
            option1: () => {
                ViewService.goToGameLiderBoardView();
            },
            option2: () => {
                ViewService.goToGameView();
            },
        });

        this.optionsTabbar.onChange();
    }

    public clear(): void {
        this.parent.el.innerHTML = '';

        this.optionsTabbar = null;
    }
}

export default GameMenuLayer;