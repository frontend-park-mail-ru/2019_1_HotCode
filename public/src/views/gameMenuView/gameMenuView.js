'use strict';

import Component from "../../components/baseComponent";
import Tabbar from "../../components/tabbar/tabbar";
import Paginator from "../../components/pagination/paginator";

const gameMenuTmpl = require('./gameMenuView.pug');
const tableTmpl = require('./table.pug');

const users = {
    users : [
        {
            name: 'Fredy',
            score: 34
        },
        {
            name: 'Fredy',
            score: 34
        },
        {
            name: 'Dorofeev',
            score: 5462
        },
        {
            name: 'Romanov',
            score: 4354
        },
        {
            name: 'Fredy',
            score: 34
        }
    ]
};

class GameMenuView {
    constructor() {
        this.parent = new Component(document.querySelector('div.container'));
    }

    render() {
        this.parent.el.innerHTML = gameMenuTmpl();

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

                this.liderBoardTable = new Component(this.parent.el.querySelector('table'));
                this.liderBoardTable.el.innerHTML = tableTmpl(users);

                this.paginator = new Paginator(this.parent.el.querySelector('.pagination'));
                // this.paginator.activePage = 4;
                // this.paginator.pageCount = 8;
            },
        });

        this.optionsTabbar.onChange();
    }
}

export default GameMenuView;