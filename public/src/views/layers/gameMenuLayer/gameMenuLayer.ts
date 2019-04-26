'use strict';

import Component from "../../../components/baseComponent/index";
import Tabbar from "../../../components/tabbar/tabbar";
import Game from "../../../models/game";
import Parallax from '../../../modules/parallax';
import Layer from '../layer';
import ViewService from '../../../services/view-service';
import GameService from '../../../services/game-service';
import EventBus from '../../../modules/event-bus';
import {events} from '../../../modules/utils/events';
import DescriptionPage from '../../pages/gameMenuPages/descriptionPage/descriptionPage';

class GameMenuLayer extends Layer {

    private static template = require('./gameMenuLayer.pug');

    private optionsTabbar: Tabbar;

    private onTitleChange: {[key: string]: () => void};
    private onBackgroundChange: {[key: string]: () => void};
    private onLogoChange: {[key: string]: () => void};

    constructor(parent: Component) {
        super(parent);
    }

    public render(slug: string): void {
        this.renderTmpl(GameMenuLayer.template, {
            title: Game.title,
            backgroundUUID: Game.backgrondUUID,
            logoUUID: Game.logoUUID,
        });

        this.onTitleChange = EventBus.subscribe(events.onTitleChange, () => {

            new Component(this.parent.el.querySelector('.game-menu__header__logo'))
                .setText(Game.title);
        });

        this.onBackgroundChange = EventBus.subscribe(events.onBackgroundChange, () => {

            (new Component(this.parent.el.querySelector('.background_theme_gamemenu-img'))
                .el as HTMLImageElement).src = `https://warscript-images.herokuapp.com/photos/${Game.backgrondUUID}`;
        });

        this.onLogoChange = EventBus.subscribe(events.onLogoChange, () => {

            (new Component(this.parent.el.querySelector('.game-menu__main__content-right__item'))
                .el as HTMLImageElement).src = `https://warscript-images.herokuapp.com/photos/${Game.logoUUID}`;
        });

        const parallax = new Parallax(new Component(this.parent.el.querySelector('.background_theme_gamemenu-img')),
            100,
            80);
        parallax.onMouseMove();
        parallax.moveBackground();

        this.optionsTabbar = new Tabbar(this.parent.el.querySelector('.options__check'), {
            option0: () => {
                ViewService.goToGameDescriptionView(Game.slug);
            },
            option1: () => {
                ViewService.goToGameLiderBoardView(Game.slug);
            },
            option2: () => {
                ViewService.goToGameView(Game.slug);
            },
        });

        this.optionsTabbar.onChange();

        GameService.getGame(slug);
    }

    public clear(): void {
        this.parent.el.innerHTML = '';
        this.onTitleChange.unsubscribe();
        this.onBackgroundChange.unsubscribe();
        this.onLogoChange.unsubscribe();

        this.optionsTabbar = null;
    }
}

export default GameMenuLayer;