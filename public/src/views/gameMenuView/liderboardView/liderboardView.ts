'use strict';

import Component from "../../../components/baseComponent/index";
import Paginator from "../../../components/pagination/paginator";
import GameService from "../../../services/game-service";
import EventBus from '../../../modules/event-bus';

const tableTmpl = require('../../../components/table/table.pug');

class LiderboardView {

    private _parent: Component;

    private _defaultLimit: number;
    private _liderBoardTable: Component;
    private _paginator: Paginator;

    constructor() {
        this._parent = new Component(document.querySelector('.game__leaderboard'));
    }

    public render(): void {

        this._defaultLimit = 6;

        this._paginator = new Paginator(this._parent.el.querySelector('.pagination'), this._defaultLimit);

        EventBus.subscribe('fullTable', table => {
            this._liderBoardTable.el.innerHTML = tableTmpl(table);
        });

        this._liderBoardTable = new Component(this._parent.el.querySelector('table'));

        GameService.getScores(1, this._defaultLimit, 0)
            .then(resp => {
                EventBus.publish('fullTable', {users: resp, offset: 0});
                return GameService.getCountUsers(1);
            })
            .then(resp => {
                this._paginator.pageCount = Math.floor((resp.count - 1) / this._defaultLimit + 1);
            })
            .catch(() => {
                // console.log(err.message);
            });
    }

    public clear(): void {
        this._paginator = null;
        this._liderBoardTable = null;
    }
}

export default LiderboardView;