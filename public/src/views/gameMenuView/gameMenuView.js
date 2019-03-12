'use strict';

import Component from "../../components/baseComponent";
import Tabbar from "../../components/tabbar/tabbar";
import Paginator from "../../components/pagination/paginator";
import GameService from "../../services/game-service";
import Game from "../../models/game";
import EventBus from '../../modules/event-bus';

const gameMenuTmpl = require('./gameMenuView.pug');
const tableTmpl = require('../../components/table/table.pug');

class GameMenuView {
    constructor() {
        this.parent = new Component(document.querySelector('div.container'));
        this._renderLimitLiderBpard = 1;
    }

    render() {
        this.parent.el.innerHTML = gameMenuTmpl({title: Game.name});

        this.descriptionSection = new Component(this.parent.el.querySelector('.game__description'));

        this.ruleSection = new Component(this.parent.el.querySelector('.game__rule'));

        this.liderBoardSection = new Component(this.parent.el.querySelector('.game__leaderboard'));

        this.optionsTabbar = new Tabbar(this.parent.el.querySelector('.options__check'), {
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

                this.renderLiderboard();
            },
        });

        this.optionsTabbar.onChange();
    }

    renderLiderboard() {
        if (this._renderLimitLiderBpard <= 0) {
            return
        }
        this._renderLimitLiderBpard -=1;


        this.defaultLimit = 6;

        this.paginator = new Paginator(this.parent.el.querySelector('.pagination'), this.defaultLimit);

        EventBus.subscribe('fullTable', table => {
            this.liderBoardTable.el.innerHTML = tableTmpl(table);
        });

        this.liderBoardTable = new Component(this.parent.el.querySelector('table'));

        GameService.getScores(1, this.defaultLimit, 0)
            .then(resp => {
                EventBus.publish('fullTable', {users: resp, offset: 0});
                return GameService.getCountUsers(1);
            })
            .then(resp => {
                this.paginator.pageCount = parseInt((resp.count - 1) / this.defaultLimit + 1);
            })
            .catch(() => {
                // console.log(err.message);
            });
    }
}

export default GameMenuView;