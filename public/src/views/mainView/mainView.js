'use strict';

import Component from "../../components/baseComponent";
import Carousel from "../../components/carousel/carousel";
import GameMenuView from "../gameMenuView/gameMenuView";
import GameService from "../../services/game-service";

const mainTmpl = require('./mainView.pug');

class MainView {
    constructor() {
        this.parent = new Component(document.querySelector('div.container'));
    }

    render() {
        const gameMenuView = new GameMenuView();
        this.parent.el.innerHTML = mainTmpl();

        GameService.getGames()
            .then(resp => {
                this.carousel = new Carousel(this.parent.el.querySelector('.carusel'), resp, () => {
                    GameService.getGame(1)
                        .then(() => gameMenuView.render())
                });

                this.carousel.onClick();
            })
            .catch(() => {
                // console.log(err.message);
            });


    }
}

export default MainView;