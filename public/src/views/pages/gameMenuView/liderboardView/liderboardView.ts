'use strict';

import Component from "../../../../components/baseComponent/index";
import Paginator from "../../../../components/pagination/paginator";
import GameService from "../../../../services/game-service";
import EventBus from '../../../../modules/event-bus';
import {events} from '../../../../modules/utils/events';
import Page from '../../page';

const tableTmpl = require('../../../../components/table/table.pug');

class LiderboardView extends Page{

    private static template = require('./liderboardView.pug');

    private defaultLimit: number;
    private liderBoardTable: Component;
    private paginator: Paginator;

    constructor(parent: Component) {
        super(parent, 'LiderBoard - Game - WarScript');
    }

    public render(): void {
        super.render();
        this.renderTmpl(LiderboardView.template);

        this.defaultLimit = 6;

        this.paginator = new Paginator(this.parent.el.querySelector('.pagination'), this.defaultLimit);


        EventBus.subscribe(events.fillTable, table => {
            this.liderBoardTable.el.innerHTML = tableTmpl(table);
        });


        this.liderBoardTable = new Component(this.parent.el.getElementsByTagName('table')[0]);


        GameService.getScores(1, this.defaultLimit, 0)
            .then(resp => {

                EventBus.publish(events.fillTable, {users: resp, offset: 0});
                return GameService.getCountUsers(1);

            })
            .then(resp => {

                this.paginator.pageCount = Math.floor((resp.count - 1) / this.defaultLimit + 1);

            })
    }



    public clear(): void {
        this.parent.el.innerHTML = '';

        this.paginator = null;
        this.liderBoardTable = null;
    }
}

export default LiderboardView;