'use strict';

import Component from "../../../../components/baseComponent/index";
import Page from '../../page';
import User from "../../../../models/user";
import EventBus from '../../../../modules/event-bus';
import {events} from '../../../../modules/utils/events';
import AnotherUser from '../../../../models/anotherUser';
import Button from '../../../../components/button/button';
import ScrollableBlock from '../../../../components/scrollable/scrollable';
import Game from '../../../../models/game';
import BotsService from '../../../../services/bots-service';
import MatchShort from '../../../../components/matchShort/matchShort';

class UserMatchesPage extends Page{

    private static template = require('./userMatchesPage.pug');

    private matchTable: ScrollableBlock;
    private partMatchTable: Component;
    private moreButton: Button;
    private moreButtonComponent: Component;
    private choiseButton: Component;

    private lastMatchId: number;
    private countRenderButton: number;

    private onIdChange: {[key: string]: () => void};
    private onAnotherIdChange: {[key: string]: () => void};

    constructor(parent: Component) {
        super(parent, 'Matches - WarScript');
    }

    public render(): void {

        super.render();
        this.renderTmpl(UserMatchesPage.template);

        this.countRenderButton = 0;

        this.choiseButton = new Component(document.querySelector('.menu__item__option_theme_matches'));

        EventBus.subscribe(events.onUserIDRender, () => {
            EventBus.publish(events.onOpenUserMatches, true);
        });
        EventBus.subscribe(events.onAnotherUserIDChange, () => {
            EventBus.publish(events.onOpenUserMatches, true);
        });

        if (User.id || AnotherUser.id) {

            EventBus.publish(events.onOpenUserMatches, true);
        }

        this.choiseButton.active();

        this.partMatchTable = new Component(this.parent.el.querySelector('.part-matches-content'));

        this.matchTable = new ScrollableBlock(this.parent.el.querySelector('.matches-content'));
        this.matchTable.decorate();

        this.moreButtonComponent =
            new Component(this.parent.el.querySelector('.match__item_theme_load'));

        this.moreButton = new Button(this.parent.el.querySelector('#moreMatches'));

        this.moreButton.callback = () => {

            this.moreButtonComponent.removeClass('link');
            this.moreButtonComponent.removeClass('pointer');
            this.moreButtonComponent.addClass('disable');
            (this.moreButton.el as HTMLInputElement).disabled = true;

            const username = AnotherUser.username || User.username;

            return BotsService.getMoreUserMatches(username, this.lastMatchId, 10)
                .then((resp) => {
                    if (!resp.length) {

                        this.moreButtonComponent
                            .setTextAnim('No more data. Try to download more?');
                        this.matchTable.onEndScroll = null;

                    } else {

                        this.moreButtonComponent.setTextAnim('Load more');
                        this.fillTable(resp);
                    }

                    (this.moreButton.el as HTMLInputElement).disabled = false;
                    this.moreButtonComponent.addClass('link');
                    this.moreButtonComponent.addClass('pointer');
                    this.moreButtonComponent.removeClass('disable');

                    return;
                });
        };

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

        this.matchTable = null;
        this.partMatchTable = null;
        this.onIdChange.unsubscribe();
        this.onAnotherIdChange.unsubscribe();
    }

    private fillTable(data: any[]): void {

        data.map((match: any) => {

            this.partMatchTable.append(
                MatchShort.CreateMatch(
                    match.id,
                    match.game_slug,
                    match.author_1,
                    match.bot1_id,
                    match.author_2,
                    match.bot2_id,
                    match.result,
                    match.diff1,
                    match.diff2,
                )
            );

            this.lastMatchId = match.id;
        });
    }

    private initTable(data: any[]): void {

        this.partMatchTable.clear();

        data.map((match: any) => {

            this.partMatchTable.append(
                MatchShort.CreateMatch(
                    match.id,
                    match.game_slug,
                    match.author_1,
                    match.bot1_id,
                    match.author_2,
                    match.bot2_id,
                    match.result,
                    match.diff1,
                    match.diff2,
                )
            );

            this.lastMatchId = match.id;
        });

        if (this.countRenderButton < 1) {
            this.moreButton.onClick();
            this.matchTable.onEndScroll = this.moreButton.callback;

            this.countRenderButton++;
        }
    }

    private handleOnUserId(): void {

        const username = AnotherUser.username || User.username;
        BotsService.getUserMatches(username)
            .then((resp) => {

                this.initTable(resp);


            });
    }
}

export default UserMatchesPage;