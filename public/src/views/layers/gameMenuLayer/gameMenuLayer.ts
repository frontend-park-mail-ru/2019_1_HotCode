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
import Checkbox from '../../../components/checkbox/checkbox';
import Button from '../../../components/button/button';

class GameMenuLayer extends Layer {

    private static template = require('./gameMenuLayer.pug');

    private optionsTabbar: Tabbar;
    private navMenuButton: Checkbox;
    private backButton: Button;

    private onTitleChange: {[key: string]: () => void};
    private onBackgroundChange: {[key: string]: () => void};
    private onLogoChange: {[key: string]: () => void};
    private onSlugChange: {[key: string]: () => void};
    private hideMenu: {[key: string]: () => void};

    constructor(parent: Component) {
        super(parent);
    }

    public render(param: string[]): void {
        this.renderTmpl(GameMenuLayer.template);

        EventBus.publish(events.onStopGenerateSqures);

        const navMenu = new Component(this.parent.el.querySelector('.container_theme_game-menu'));
        const logoPanel = new Component(this.parent.el.querySelector('.menu__item_theme_logo'));
        const titlePanel = new Component(this.parent.el.querySelector('.menu__item_theme_title'));
        const optionsPanel = new Component(this.parent.el.querySelector('.menu__item_theme_options'));
        const backPanel = new Component(this.parent.el.querySelector('.menu__item_theme_back'));
        const menuAnimHide = new Component(this.parent.el.querySelector('#menuHide'));
        const menuAnimShow = new Component(this.parent.el.querySelector('#menuShow'));
        const footer = new Component(document.querySelector('.footer'));
        const header = new Component(document.querySelector('.header'));

        this.navMenuButton = new Checkbox(this.parent.el.querySelector('#menuNavBar'),
            () => {

                logoPanel.el.style.transform = 'translateX(0)';
                titlePanel.el.style.transform = 'translateX(0)';
                optionsPanel.el.style.transform = 'translateX(0)';
                backPanel.el.style.transform = 'translateX(0)';

                navMenu.el.style.pointerEvents = 'none';

                logoPanel.el.style.animation = 'hideMenu 1.2s ease 0.6s forwards';
                titlePanel.el.style.animation = 'hideMenu 1.1s ease 0.3s forwards';
                optionsPanel.el.style.animation = 'hideMenu 1s ease forwards';
                backPanel.el.style.animation = 'hideMenu 1.1s ease 0.3s forwards';

                header.el.style.left = '';
                footer.el.style.paddingLeft = '';
                (menuAnimHide.el as any).beginElement();
            },
            () => {

                logoPanel.el.style.transform = 'translateX(-180%)';
                titlePanel.el.style.transform = 'translateX(-180%)';
                optionsPanel.el.style.transform = 'translateX(-180%)';
                backPanel.el.style.transform = 'translateX(-180%)';

                navMenu.el.style.pointerEvents = 'auto';

                logoPanel.el.style.animation = 'showMenu 1.2s ease forwards';
                titlePanel.el.style.animation = 'showMenu 1.1s ease 0.3s forwards';
                optionsPanel.el.style.animation = 'showMenu 1s ease 0.6s forwards';
                backPanel.el.style.animation = 'showMenu 1.1s ease 0.3s forwards';

                header.el.style.left = 'calc(2.5vw + 325px + 4.34%)';
                footer.el.style.paddingLeft = 'calc(2.5vw + 325px + 4.34%)';
                (menuAnimShow.el as any).beginElement();
            });
        this.navMenuButton.onChange();

        this.hideMenu = EventBus.subscribe(events.onHideMenu, () => {

            if (!this.navMenuButton.isChecked()) {

                this.navMenuButton.emitCheck();
            }
        });

        this.navMenuButton.emitCancel();

        this.onTitleChange = EventBus.subscribe(events.onTitleChange, () => {

            new Component(this.parent.el.querySelector('.menu__item__title'))
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

            const logoImage = new Component(this.parent.el.querySelector('.menu__item__img'));

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
                    ViewService.goToGameView(Game.slug);
                },
                option1: () => {
                    ViewService.goToGameDescriptionView(Game.slug);
                },
                option2: () => {
                    ViewService.goToGameLiderBoardView(Game.slug);
                },
                option3: () => {
                    ViewService.goToGameMatchesView(Game.slug);
                },
                option4: () => {
                    return;
                },
            });

            this.optionsTabbar.onChange();
        });

        this.backButton = new Button(this.parent.el.querySelector('#menuBackButton'),
            () => {
            ViewService.goToMainView();
        });
        this.backButton.onClick();

        GameService.getGame(param[0]);
    }

    public clear(): void {
        this.parent.el.innerHTML = '';

        EventBus.publish(events.onContinueGenerateSqures);

        this.hideMenu.unsubscribe();
        this.onTitleChange.unsubscribe();
        this.onBackgroundChange.unsubscribe();
        this.onLogoChange.unsubscribe();
        this.onSlugChange.unsubscribe();

        const footer = new Component(document.querySelector('.footer'));
        const header = new Component(document.querySelector('.header'));
        header.el.style.left = '';
        footer.el.style.paddingLeft = '';

        Game.clearData();

        this.optionsTabbar = null;
        this.navMenuButton = null;
        this.backButton = null;
    }
}

export default GameMenuLayer;