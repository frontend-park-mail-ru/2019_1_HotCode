'use strict';

import Component from "../../../../components/baseComponent/index";
import Paginator from "../../../../components/pagination/paginator";
import GameService from "../../../../services/game-service";
import EventBus from '../../../../modules/event-bus';
import {events} from '../../../../modules/utils/events';
import Page from '../../page';
import Table from '../../../../components/table/table';
import Game from "../../../../models/game";

class LiderboardPage extends Page{

    private static template = require('./liderboardPage.pug');

    private defaultLimit: number;
    private liderBoardTable: Table;
    private paginator: Paginator;

    private fillTable: {[key: string]: () => void};

    constructor(parent: Component) {
        super(parent, 'LiderBoard - Game - WarScript');
    }

    public render(): void {
        super.render();
        this.renderTmpl(LiderboardPage.template);

        const gameContainer = new Component(document.querySelector('.container_theme_game-menu'));
        const gameImageLogo = new Component(document.querySelector('.game-menu__main__content-right'));
        const gameContent = new Component(document.querySelector('.game-menu__main__content-left'));

        gameContainer.removeClass('container_theme_game-play');
        gameImageLogo.show();
        gameContent.removeClass('game-menu__main__content-left_theme_play');

        this.defaultLimit = 6;

        this.paginator = new Paginator(this.parent.el.querySelector('.pagination'),
            this.defaultLimit,
            this.getScoresCallback);

        this.liderBoardTable = new Table(this.parent.el.querySelector('.table'));

        this.fillTable = EventBus.subscribe(events.fillTable, (table) => {
            this.liderBoardTable.render(table);
        });

        this.getScoresCallback(this.defaultLimit, 0);
    }

    public clear(): void {
        this.parent.el.innerHTML = '';

        this.fillTable.unsubscribe();
        this.paginator = null;
        this.liderBoardTable = null;
    }

    private getScoresCallback = (limit: number, offset: number): void => {

        GameService.getScores(Game.slug, limit, offset)
            .then((resp) => {

                EventBus.publish(events.fillTable, {users: resp, offset});
                return GameService.getCountUsers(Game.slug);

            })
            .then((resp) => {

                this.paginator.pageCount = Math.floor((resp.count - 1) / limit + 1);
                this.paginator.renderPaginator();

            })
            .catch(() => {
                // console.log(err.message);
            });
    }
}

export default LiderboardPage;