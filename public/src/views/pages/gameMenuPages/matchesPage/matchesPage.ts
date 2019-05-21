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

class MatchesPage extends Page{

    private static template = require('./matchesPage.pug');

    private matchTable: Component;
    private moreButton: Button;

    private lastMatchId: number;

    private onSlugChange: {[key: string]: () => void};

    constructor(parent: Component) {
        super(parent, 'Matches - Game - WarScript');
    }

    public render(): void {

        super.render();
        this.renderTmpl(MatchesPage.template);

        this.matchTable = new Component(this.parent.el.querySelector('.matches-content'));

        this.moreButton = new Button(this.parent.el.querySelector('#moreMatches'),
            () => {

                BotsService.getMoreMatches(Game.slug, this.lastMatchId, 10)
                    .then((resp) => {

                        this.fillTable(resp);
                    })
            }
        );

        this.onSlugChange = EventBus.subscribe(events.onSlugChange, () => {

            BotsService.getMatches(Game.slug)
                .then((resp) => {

                    this.fillTable(resp);

                    this.moreButton.onClick();
                });
        });

        if (Game.slug) {
            EventBus.publish(events.onSlugChange);
        }
    }

    public clear(): void {
        this.parent.el.innerHTML = '';
        this.matchTable = null;
        this.onSlugChange.unsubscribe();
    }


    private fillTable(data: any[]): void {

        data.map((match: any) => {

            this.matchTable.append(
                MatchShort.CreateMatch(
                    match.id,
                    match.author_1,
                    match.author_2,
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