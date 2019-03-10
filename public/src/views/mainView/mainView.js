'use strict';

import Component from "../../components/baseComponent";
import Carousel from "../../components/carousel/carousel";
import GameMenuView from "../gameMenuView/gameMenuView";

const mainTmpl = require('./mainView.pug');

class MainView {
    constructor() {
        this.parent = new Component(document.querySelector('div.container'));
    }

    render() {
        const gameMenuView = new GameMenuView();
        this.parent.el.innerHTML = mainTmpl();

        this.carousel = new Carousel(this.parent.el.querySelector('.carusel'), () => {
            gameMenuView.render();
        });

        this.carousel.onClick();
    }
}

export default MainView;