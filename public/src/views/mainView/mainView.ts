'use strict';

import Component from "../../components/baseComponent/index";
import Carousel from "../../components/carousel/carousel";
import GameMenuView from "../gameMenuView/gameMenuView";
import GameService from "../../services/game-service";

class MainView {

    private _parent : Component;
    private _template = require('./mainView.pug');

    private _mainCarousel : Carousel;

    constructor() {
        this._parent = new Component(document.querySelector('div.container'));
    }

    public render(): void {
        this._parent.el.innerHTML = this._template();

        const gameMenuView = new GameMenuView();


        this._mainCarousel = new Carousel(this._parent.el.querySelector('.carusel'), () => {
            GameService.getGame(1)
                .then(() => gameMenuView.render())
        });

        GameService.getGames()
            .then(resp => {
                this._mainCarousel.renderCarousel(resp);
                this._mainCarousel.onClick();
            })
    }

    public clear(): void {
        this._parent.el.innerHTML = '';
        this._mainCarousel = null;
    }
}

export default MainView;