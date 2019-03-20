'use strict';

import Component from "../../components/baseComponent/index";
import Tabbar from "../../components/tabbar/tabbar";
import Game from "../../models/game";
import LiderboardView from "./liderboardView/liderboardView";

const tableTmpl = require('../../components/table/table.pug');

class GameMenuView {

    private _parent: Component;
    private _template = require('./gameMenuView.pug');

    private descriptionSection: Component;
    private ruleSection: Component;
    private liderBoardSection: Component;
    private optionsTabbar: Tabbar;

    private liderBoardView: LiderboardView;

    private _renderLimitLiderBpard: number;

    constructor() {
        this._parent = new Component(document.querySelector('div.container'));

        this._renderLimitLiderBpard = 1;
    }

    public render(): void {
        this._parent.el.innerHTML = this._template({title: Game.name});

        this.liderBoardView = new LiderboardView();

        this.descriptionSection = new Component(this._parent.el.querySelector('.game__description'));

        this.ruleSection = new Component(this._parent.el.querySelector('.game__rule'));

        this.liderBoardSection = new Component(this._parent.el.querySelector('.game__leaderboard'));

        this.optionsTabbar = new Tabbar(this._parent.el.querySelector('.options__check'), {
            'option0': () => {
                this.descriptionSection.show();
                this.ruleSection.hide();
                this.liderBoardSection.hide();
            },
            'option1': () => {
                this.descriptionSection.hide();
                this.ruleSection.show();
                this.liderBoardSection.hide();
            },
            'option2': () => {
                this.descriptionSection.hide();
                this.ruleSection.hide();
                this.liderBoardSection.show();

                if (this._renderLimitLiderBpard >= 1) {
                    this.liderBoardView.render();
                    this._renderLimitLiderBpard--;
                }
            },
        });

        this.optionsTabbar.onChange();
    }

    private clear(): void {
        this._parent.el.innerHTML = '';

        this.liderBoardView.clear();
        this.descriptionSection = null;
        this.ruleSection = null;
        this.liderBoardSection = null;
        this.optionsTabbar = null;
    }
}

export default GameMenuView;