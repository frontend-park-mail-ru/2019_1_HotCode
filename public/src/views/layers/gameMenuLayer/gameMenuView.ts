'use strict';

import Component from "../../../components/baseComponent/index";
import Tabbar from "../../../components/tabbar/tabbar";
import Game from "../../../models/game";
import Parallax from '../../../modules/parallax';
import Layer from '../layer';
import ViewService from '../../../services/view-service';

class GameMenuView extends Layer {

    private static template = require('./gameMenuView.pug');

    private optionsTabbar: Tabbar;

    constructor(parent: Component) {
        super(parent);
    }

    public render(): void {
        this.renderTmpl(GameMenuView.template, {title: Game.name});

        const parallax = new Parallax(new Component(this.parent.el.querySelector('.game__background__img img')));
        parallax.moveBackground();

        this.optionsTabbar = new Tabbar(this.parent.el.querySelector('.options__check'), {
            'option0': () => {
                ViewService.goToGameDescriptionView();
            },
            'option1': () => {
                ViewService.goToGameLiderBoardView();
            },
            'option2': () => {
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

export default GameMenuView;