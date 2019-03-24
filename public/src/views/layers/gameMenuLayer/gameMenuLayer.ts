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
        this.renderTmpl(GameMenuLayer.template, {title: Game.name});

        const parallax = new Parallax(new Component(this.parent.el.querySelector('.game__background__img img')));
        parallax.moveBackground();

        this.gameContainer = new Component(this.parent.el.querySelector('.game'));
        this.gameImageLogo = new Component(this.parent.el.querySelector('.game__right__content'));
        this.gameContent = new Component(this.parent.el.querySelector('.game__left__content'));

        this.optionsTabbar = new Tabbar(this.parent.el.querySelector('.options__check'), {
            'option0': () => {
                this.gameContainer.removeClass('game__play');
                this.gameImageLogo.show();
                this.gameContent.removeClass('game__play__content');
                ViewService.goToGameDescriptionView();

            },
            'option1': () => {
                this.gameContainer.removeClass('game__play');
                this.gameImageLogo.show();
                this.gameContent.removeClass('game__play__content');
                ViewService.goToGameLiderBoardView();
            },
            'option2': () => {
                this.gameContainer.addClass('game__play');
                this.gameImageLogo.hide();
                this.gameContent.addClass('game__play__content');
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