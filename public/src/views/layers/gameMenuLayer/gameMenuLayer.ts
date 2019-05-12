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
import AvatarService from '../../../services/avatar-service';
import User from '../../../models/user';

class GameMenuLayer extends Layer {

    private static template = require('./gameMenuLayer.pug');

    private optionsTabbar: Tabbar;

    private onTitleChange: {[key: string]: () => void};
    private onBackgroundChange: {[key: string]: () => void};
    private onLogoChange: {[key: string]: () => void};
    private onSlugChange: {[key: string]: () => void};

    constructor(parent: Component) {
        super(parent);
    }

    public render(param: string[]): void {
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

            const backgroundImage = new Component(this.parent.el.querySelector('.background_theme_gamemenu-img'));

            AvatarService.getAvatar(Game.backgrondUUID)
                .then((img) => {
                    (backgroundImage.el as HTMLImageElement).src = URL.createObjectURL(img);
                });
        });

        this.onLogoChange = EventBus.subscribe(events.onLogoChange, () => {

            const logoImage = new Component(this.parent.el.querySelector('.game-menu__right__item'));

            AvatarService.getAvatar(Game.logoUUID)
                .then((img) => {
                    (logoImage.el as HTMLImageElement).src = URL.createObjectURL(img);
                });
        });

        const parallax = new Parallax(new Component(this.parent.el.querySelector('.background_theme_gamemenu-img')),
            100,
            80);
        parallax.onMouseMove();
        parallax.moveBackground();

        this.onSlugChange = EventBus.subscribe(events.onSlug2Change, () => {
            this.optionsTabbar = new Tabbar(this.parent.el.querySelector('.options__check'), {
                option0: () => {
                    ViewService.goToGameDescriptionView(Game.slug);
                },
                option1: () => {
                    ViewService.goToGameLiderBoardView(Game.slug);
                },
                option2: () => {
                    ViewService.goToGameMatchesView(Game.slug);
                },
                option3: () => {
                    ViewService.goToGameView(Game.slug);
                },
            });

            this.optionsTabbar.onChange();
        });

        GameService.getGame(param[0]);
    }

    public clear(): void {
        this.parent.el.innerHTML = '';
        this.onTitleChange.unsubscribe();
        this.onBackgroundChange.unsubscribe();
        this.onLogoChange.unsubscribe();
        this.onSlugChange.unsubscribe();

        this.optionsTabbar = null;
    }
}

export default GameMenuLayer;