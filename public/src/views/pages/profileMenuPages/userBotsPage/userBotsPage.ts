'use strict';

import Component from "../../../../components/baseComponent/index";
import Page from '../../page';
import User from "../../../../models/user";
import EventBus from '../../../../modules/event-bus';
import {events} from '../../../../modules/utils/events';
import AnotherUser from '../../../../models/anotherUser';
import Button from '../../../../components/button/button';
import BotsService from '../../../../services/bots-service';
import Table2 from '../../../../components/table/table2';

class UserBotsPage extends Page{

    private static template = require('./userBotsPage.pug');

    private liderBoardTable: Table2;
    private loadMoreDataButton: Button;
    private loadMoreDataButtonComponent: Component;
    private choiseButton: Component;

    private countRenderButton: number;

    private fillTable: {[key: string]: () => void};
    private onUpdateTable: {[key: string]: () => void};
    private onIdChange: {[key: string]: () => void};
    private onAnotherIdChange: {[key: string]: () => void};

    constructor(parent: Component) {
        super(parent, 'Bots - WarScript');
    }

    public render(): void {

        super.render();
        this.renderTmpl(UserBotsPage.template);

        this.countRenderButton = 0;

        this.choiseButton = new Component(document.querySelector('.menu__item__option_theme_bots'));

        EventBus.subscribe(events.onUserIDRender, () => {
            EventBus.publish(events.onOpenUserBots, true);
        });
        EventBus.subscribe(events.onAnotherUserIDChange, () => {
            EventBus.publish(events.onOpenUserBots, true);
        });

        if (User.id || AnotherUser.id) {

            EventBus.publish(events.onOpenUserBots, true);
        }

        this.choiseButton.active();



        this.onIdChange = EventBus.subscribe(events.onUsernameChange, () => {

            this.handleOnUserId();
        });

        this.onAnotherIdChange = EventBus.subscribe(events.onAnotherUsernameChange, () => {

            this.handleOnUserId();
        });

        if (AnotherUser.id || User.id) {

            this.handleOnUserId();
        }
    }

    public clear(): void {
        this.parent.el.innerHTML = '';

        this.choiseButton.disactive();


        this.fillTable.unsubscribe();
        this.onUpdateTable.unsubscribe();
        this.liderBoardTable = null;

        this.onIdChange.unsubscribe();
        this.onAnotherIdChange.unsubscribe();
    }

    private handleOnUserId(): void {

        if (this.countRenderButton < 1) {

            this.liderBoardTable = new Table2(this.parent.el.querySelector('.table'));

            this.fillTable = EventBus.subscribe(events.fillTable, (table) => {
                this.liderBoardTable.render(table);

                this.loadMoreDataButton = new Button(this.parent.el.querySelector('#loadMoreBots'));

                this.loadMoreDataButtonComponent =
                    new Component(this.parent.el.querySelector('.match__item_theme_load'));

                this.loadMoreDataButton.callback = () => {

                    this.loadMoreDataButtonComponent.removeClass('link');
                    this.loadMoreDataButtonComponent.removeClass('pointer');
                    this.loadMoreDataButtonComponent.addClass('disable');
                    (this.loadMoreDataButton.el as HTMLInputElement).disabled = true;

                    const username = AnotherUser.username || User.username;

                    return BotsService.getMoreUserBots(username, this.liderBoardTable.lastRowId, 10)
                        .then((resp) => {
                            if (!resp.length) {

                                this.loadMoreDataButtonComponent
                                    .setTextAnim('No more data. Try to download more?');
                                this.liderBoardTable.handleEndTable(null);

                            } else {

                                this.loadMoreDataButtonComponent.setTextAnim('Load more');
                                EventBus.publish(events.updateTable, resp);
                            }

                            (this.loadMoreDataButton.el as HTMLInputElement).disabled = false;
                            this.loadMoreDataButtonComponent.addClass('link');
                            this.loadMoreDataButtonComponent.addClass('pointer');
                            this.loadMoreDataButtonComponent.removeClass('disable');

                            return;
                        });
                };

                this.loadMoreDataButton.onClick();

                this.liderBoardTable.handleEndTable(this.loadMoreDataButton.callback);
            });

            this.onUpdateTable = EventBus.subscribe(events.updateTable, (newRows) => {
                this.liderBoardTable.fillTable(newRows);
            });

            this.getScoresCallback();

            this.countRenderButton++;
        }
    }

    private getScoresCallback = (): void => {

        const username = AnotherUser.username || User.username;
        BotsService.getUserBots(username)
            .then((resp) => {

                EventBus.publish(events.fillTable, resp);

            });
    };
}

export default UserBotsPage;