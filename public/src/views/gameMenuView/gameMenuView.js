'use strict';

import Component from "../../components/baseComponent";
import Tabbar from "../../components/tabbar/tabbar";
import Paginator from "../../components/pagination/paginator";
import GameService from "../../services/game-service";

const gameMenuTmpl = require('./gameMenuView.pug');
const tableTmpl = require('./table.pug');

// const users = {
//     users : [
//         {
//             username: 'Fredy',
//             score: 34
//         },
//         {
//             username: 'Fredy',
//             score: 34
//         },
//         {
//             username: 'Dorofeev',
//             score: 5462
//         },
//         {
//             username: 'Romanov',
//             score: 4354
//         },
//         {
//             username: 'Fredy',
//             score: 34
//         }
//     ]
// };

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

                this.defaultLimit = 7;

                this.liderBoardTable = new Component(this.parent.el.querySelector('table'));
                GameService.getScores(1, this.defaultLimit, 0, (err, resp) => {
                    if (err) {
                        // console.log(err.message);
                    } else {
                        this.liderBoardTable.el.innerHTML = tableTmpl({users: resp});
                    }
                });

                this.paginator = new Paginator(this.parent.el.querySelector('.pagination'), this.defaultLimit);
            },
        });

        this.optionsTabbar.onChange();
    }
}

export default GameMenuView;