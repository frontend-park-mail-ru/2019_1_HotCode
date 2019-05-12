'use strict';

import Component from "../../../../components/baseComponent/index";
import Page from '../../page';
import Game from "../../../../models/game";
import EventBus from '../../../../modules/event-bus';
import {events} from '../../../../modules/utils/events';
import ViewService from '../../../../services/view-service';

const data = [
    {
        id: 3,
        username: 'Test_user_2',
        result: 'Processing...',
        date: '6 Apr 2019, 19:45:39',
    },
    {
        id: 2,
        username: 'Test_user_2',
        result: 'Win',
        date: '5 Apr 2019, 19:45:39',
    },
    {
        id: 1,
        username: 'Test_user_1',
        result: 'Defeat',
        date: '20 Dec 2018, 19:45:39',
    },
];

class MatchesPage extends Page{

    private static template = require('./matchesPage.pug');

    constructor(parent: Component) {
        super(parent, 'Matches - Game - WarScript');
    }

    public render(): void {

        super.render();
        this.renderTmpl(MatchesPage.template, {matches: data});

        const matches = Array.from(this.parent.el.querySelectorAll('.match'))
            .map((match) => {

                const matchComponent = new Component(match as HTMLElement);
                matchComponent.on('click', (e) => {

                    ViewService.goToGameMatchView(
                        Game.slug,
                        matchComponent.el.getAttribute('data-id')
                    );
                });
            });
    }

    public clear(): void {
        this.parent.el.innerHTML = '';
    }
}

export default MatchesPage;