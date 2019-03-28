'use strict';

import Component from "../../../components/baseComponent/index";
import Carousel from "../../../components/carousel/carousel";
import GameService from "../../../services/game-service";
import Page from '../page';
import ViewService from '../../../services/view-service';

class MainPage extends Page {

    private static template = require('./mainPage.pug');

    private mainCarousel: Carousel;

    constructor(parent: Component) {
        super(parent, 'WarScript');
    }

    public render(): void {
        super.render();
        this.renderTmpl(MainPage.template);

        this.mainCarousel = new Carousel(this.parent.el.querySelector('.carusel'), () => {
            GameService.getGame(1)
                .then(() => ViewService.goToGameDescriptionView())
        });

        GameService.getGames()
            .then(resp => {
                this.mainCarousel.renderCarousel(resp);
                this.mainCarousel.onClick();
            })
    }

    public clear(): void {
        this.parent.el.innerHTML = '';
        this.mainCarousel = null;
        console.log('main CLEAR');
    }
}

export default MainPage;