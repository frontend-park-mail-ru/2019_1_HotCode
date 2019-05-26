'use strict';

import Component from "../../../../components/baseComponent/index";
import Page from '../../page';
import User from "../../../../models/user";
import EventBus from '../../../../modules/event-bus';
import {events} from '../../../../modules/utils/events';

class UserBotsPage extends Page{

    private static template = require('./userBotsPage.pug');

    private choiseButton: Component;

    // private onDescriptionChange: {[key: string]: () => void};

    constructor(parent: Component) {
        super(parent, 'Bots - WarScript');
    }

    public render(): void {

        super.render();
        this.renderTmpl(UserBotsPage.template);

        this.choiseButton = new Component(document.querySelector('.menu__item__option_theme_bots'));

        EventBus.subscribe(events.onUserIDChange, () => {
            EventBus.publish(events.onOpenUserBots, true);
        });

        this.choiseButton.active();

        // this.onDescriptionChange = EventBus.subscribe(events.onDescriptionChange, () => {
        //
        //     new Component(this.parent.el.querySelector('.description__text'))
        //         .setTextAnim(Game.description, 7);
        // });
        //
        // if (Game.description) {
        //     EventBus.publish(events.onDescriptionChange);
        // }
    }

    public clear(): void {
        this.parent.el.innerHTML = '';

        this.choiseButton.disactive();

        // this.onDescriptionChange.unsubscribe();
    }
}

export default UserBotsPage;