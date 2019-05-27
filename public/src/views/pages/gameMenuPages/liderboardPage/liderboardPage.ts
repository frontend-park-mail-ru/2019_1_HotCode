'use strict';

import Component from "../../../../components/baseComponent/index";
import Paginator from "../../../../components/pagination/paginator";
import GameService from "../../../../services/game-service";
import EventBus from '../../../../modules/event-bus';
import {events} from '../../../../modules/utils/events';
import Page from '../../page';
import Table from '../../../../components/table/table';
import Game from "../../../../models/game";
import BotsService from '../../../../services/bots-service';
import WebSock from '../../../../modules/webSocket';
import BotsWsService from '../../../../services/botsWs-service';
import Button from '../../../../components/button/button';

class LiderboardPage extends Page{

    private static template = require('./liderboardPage.pug');

    private defaultLimit: number;
    private liderBoardTable: Table;
    private paginator: Paginator;
    private loadMoreDataButton: Button;
    private loadMoreDataButtonComponent: Component;
    private choiseButton: Component;

    private ws: WebSock;

    private fillTable: {[key: string]: () => void};
    private onUpdateTable: {[key: string]: () => void};
    private onSlugChange: {[key: string]: () => void};

    constructor(parent: Component) {
        super(parent, 'LeaderBoard - Game - WarScript');
    }

    public render(): void {
        super.render();
        this.renderTmpl(LiderboardPage.template);

        this.choiseButton = new Component(document.querySelector('.menu__item__option_theme_leaderboard'));

        EventBus.subscribe(events.onSlug2Change, () => {

            EventBus.publish(events.onOpenLeaderBoard, true);
        });

        this.choiseButton.active();

        this.defaultLimit = 6;

        this.onSlugChange = EventBus.subscribe(events.onSlugChange, () => {

            // this.paginator = new Paginator(this.parent.el.querySelector('.pagination'),
            //     this.defaultLimit,
            //     this.getScoresCallback);

            this.liderBoardTable = new Table(this.parent.el.querySelector('.table'));

            this.fillTable = EventBus.subscribe(events.fillTable, (table) => {
                this.liderBoardTable.render(table);

                // this.loadMoreDataButton = new Button(this.parent.el.querySelector('#loadMoreBots'));
                //
                // this.loadMoreDataButtonComponent =
                //     new Component(this.parent.el.querySelector('.match__item_theme_load'));
                //
                // this.loadMoreDataButton.callback = () => {
                //     return new Promise((res, rej) => {
                //
                //         this.loadMoreDataButtonComponent.removeClass('link');
                //         this.loadMoreDataButtonComponent.removeClass('pointer');
                //         this.loadMoreDataButtonComponent.addClass('disable');
                //         (this.loadMoreDataButton.el as HTMLInputElement).disabled = true;
                //
                //         setTimeout(() => {
                //             if (!resps[i].length) {
                //
                //                 this.loadMoreDataButtonComponent
                //                     .setTextAnim('No more data. Try to download more?');
                //                 this.liderBoardTable.handleEndTable(null);
                //
                //             } else {
                //
                //                 this.loadMoreDataButtonComponent.setTextAnim('Load more');
                //                 EventBus.publish(events.updateTable, resps[i]);
                //             }
                //
                //             i++;
                //             (this.loadMoreDataButton.el as HTMLInputElement).disabled = false;
                //             this.loadMoreDataButtonComponent.addClass('link');
                //             this.loadMoreDataButtonComponent.addClass('pointer');
                //             this.loadMoreDataButtonComponent.removeClass('disable');
                //             res();
                //         }, 2000);
                //     });
                // };

                // this.loadMoreDataButton.onClick();

                // this.liderBoardTable.handleEndTable(this.loadMoreDataButton.callback);
            });

            this.onUpdateTable = EventBus.subscribe(events.updateTable, (newRows) => {
                this.liderBoardTable.fillTable(newRows);
            });

            // this.getScoresCallback(this.defaultLimit, 0);
            this.getScoresCallback();

        });

        if (Game.slug) {
            EventBus.publish(events.onSlugChange);
        }
    }

    public clear(): void {
        this.parent.el.innerHTML = '';

        this.choiseButton.disactive();

        this.fillTable.unsubscribe();
        this.onUpdateTable.unsubscribe();
        this.onSlugChange.unsubscribe();
        this.paginator = null;
        this.liderBoardTable = null;

        if (this.ws) {
            this.ws.close();
        }
        this.ws = null;
    }

    // private getScoresCallback = (limit: number, offset: number): void => {
    //
    //     GameService.getScores(Game.slug, limit, offset)
    //         .then((resp) => {
    //
    //             EventBus.publish(events.fillTable, {users: resp, offset});
    //             return GameService.getCountUsers(Game.slug);
    //
    //         })
    //         .then((resp) => {
    //
    //             this.paginator.pageCount = Math.floor((resp.count - 1) / limit + 1);
    //             this.paginator.renderPaginator();
    //
    //         })
    //         .catch(() => {
    //             // console.log(err.message);
    //         });
    // }

    private getScoresCallback = (): void => {

        BotsService.getBots(Game.slug)
            .then((resp) => {

                EventBus.publish(events.fillTable, resp);

            })
            .then(() => {

                this.ws = BotsWsService.updateBots();
                this.ws.open(
                    () => {},
                    (resp) => {
                        if (resp.type === 'match') {
                            this.liderBoardTable.updateScore(
                                resp.body.bot1_id,
                                resp.body.new_score1,
                            );
                            this.liderBoardTable.updateScore(
                                resp.body.bot2_id,
                                resp.body.new_score2,
                            );
                            return;
                        }
                    },
                    () => {},
                )
            })
            .catch(() => {
                // console.log(err.message);
            });
    };
}

export default LiderboardPage;