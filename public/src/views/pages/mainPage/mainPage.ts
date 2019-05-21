'use strict';

import Carousel from "../../../components/carousel/carousel";
import Component from "../../../components/baseComponent/index";
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

        // GameService.getGames()
        //     .then((resp) => {
        //
        //         this.mainCarousel = new Carousel(this.parent.el.querySelector('.carousel'), () => {
        //
        //             ViewService.goToGameDescriptionView(
        //                 this.mainCarousel.getCenterItem().el.getAttribute('data-slug'),
        //             );
        //         }, resp);
        //
        //     });
    }

    public clear(): void {
        this.parent.el.innerHTML = '';
        this.mainCarousel = null;
        console.log('main CLEAR');
    }
}

export default MainPage;