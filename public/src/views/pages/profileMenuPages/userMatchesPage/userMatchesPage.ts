'use strict';

import Component from "../../../../components/baseComponent/index";
import Page from '../../page';
import User from "../../../../models/user";
import EventBus from '../../../../modules/event-bus';
import {events} from '../../../../modules/utils/events';
import AnotherUser from '../../../../models/anotherUser';

class UserMatchesPage extends Page{

    private static template = require('./userMatchesPage.pug');

    private choiseButton: Component;

    constructor(parent: Component) {
        super(parent, 'Matches - WarScript');
    }

    public render(): void {

        super.render();
        this.renderTmpl(UserMatchesPage.template);

        this.choiseButton = new Component(document.querySelector('.menu__item__option_theme_matches'));

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

    }

    public clear(): void {
        this.parent.el.innerHTML = '';

        this.choiseButton.disactive();
    }
}

export default UserMatchesPage;