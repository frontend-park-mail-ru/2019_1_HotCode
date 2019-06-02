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

class UserBotsPage extends Page{

    private static template = require('./userBotsPage.pug');

    private choiseButton: Component;

    private countRenderButton: number;

    private onIdChange: {[key: string]: () => void};
    private onAnotherIdChange: {[key: string]: () => void};

    constructor(parent: Component) {
        super(parent, 'Matches - WarScript');
    }

    public render(): void {

        super.render();
        this.renderTmpl(UserBotsPage.template);

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

        this.onIdChange.unsubscribe();
        this.onAnotherIdChange.unsubscribe();
    }

    private handleOnUserId(): void {

        // const username = AnotherUser.username || User.username;
        // BotsService.getUserMatches(username)
        //     .then((resp) => {
        //
        //         this.initTable(resp);
        //
        //
        //     });
    }
}

export default UserBotsPage;