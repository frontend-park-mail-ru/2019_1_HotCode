'use strict';

import Component from "../../../../components/baseComponent/index";
import Page from '../../page';
import Game from "../../../../models/game";
import EventBus from '../../../../modules/event-bus';
import {events} from '../../../../modules/utils/events';
import ViewService from '../../../../services/view-service';
import BotsService from '../../../../services/bots-service';
import MatchShort from '../../../../components/matchShort/matchShort';
import Button from '../../../../components/button/button';
import ScrollableBlock from '../../../../components/scrollable/scrollable';
import BotsWsService from '../../../../services/botsWs-service';
import WebSock from '../../../../modules/webSocket';

class MatchesPage extends Page{

    private static template = require('./matchesPage.pug');

    private matchTable: ScrollableBlock;
    private partMatchTable: Component;
    private moreButton: Button;
    private moreButtonComponent: Component;
    private choiseButton: Component;

    private ws: WebSock;

    private lastMatchId: number;

    private onSlugChange: {[key: string]: () => void};

    constructor(parent: Component) {
        super(parent, 'Matches - Game - WarScript');
    }

    public render(): void {

        super.render();
        this.renderTmpl(MatchesPage.template);

        this.choiseButton = new Component(document.querySelector('.menu__item__option_theme_matches'));

        EventBus.subscribe(events.onSlug2Change, () => {

            EventBus.publish(events.onOpenMatches, true);
        });

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

                return BotsService.getMoreMatches(Game.slug, this.lastMatchId, 10)
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

        this.onSlugChange = EventBus.subscribe(events.onSlugChange, () => {

            BotsService.getMatches(Game.slug)
                .then((resp) => {

                    this.fillTable(resp);

                    this.moreButton.onClick();
                    this.matchTable.onEndScroll = this.moreButton.callback;
                })
                .then(() => {

                    this.ws = BotsWsService.updateBots();
                    this.ws.open(
                        () => {},
                        (resp) => {
                            if (resp.type === 'match') {

                                this.partMatchTable.unshift(
                                    MatchShort.CreateMatch(
                                        resp.body.id,
                                        resp.body.author_1,
                                        resp.body.bot1_id,
                                        resp.body.author_2,
                                        resp.body.bot2_id,
                                        resp.body.result,
                                        resp.body.diff1,
                                        resp.body.diff2,
                                        true
                                    )
                                );
                                return;
                            }
                        },
                        () => {},
                    )
                });
        });

        if (Game.slug) {
            EventBus.publish(events.onSlugChange);
        }
    }

    public clear(): void {
        this.parent.el.innerHTML = '';

        this.choiseButton.disactive();

        this.matchTable = null;
        this.partMatchTable = null;
        this.onSlugChange.unsubscribe();

        if (this.ws) {
            this.ws.close();
        }
        this.ws = null;
    }


    private fillTable(data: any[]): void {

        data.map((match: any) => {

            this.partMatchTable.append(
                MatchShort.CreateMatch(
                    match.id,
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
}

export default MatchesPage;