'use strict';

import Component from "../../../../components/baseComponent/index";
import Page from '../../page';
import Game from "../../../../models/game";
import EventBus from '../../../../modules/event-bus';
import {events} from '../../../../modules/utils/events';

class DescriptionPage extends Page{

    private static template = require('./descriptionPage.pug');

    private choiseButton: Component;

    private onDescriptionChange: {[key: string]: () => void};

    constructor(parent: Component) {
        super(parent, 'Description - Game - WarScript');
    }

    public render(): void {

        super.render();
        this.renderTmpl(DescriptionPage.template);

        this.choiseButton = new Component(document.querySelector('.menu__item__option_theme_description'));

        EventBus.subscribe(events.onSlug2Change, () => {

            EventBus.publish(events.onOpenDescription, true);
        });

        this.choiseButton.active();

        this.onDescriptionChange = EventBus.subscribe(events.onDescriptionChange, () => {

            new Component(this.parent.el.querySelector('.description__text'))
                .setTextAnim(Game.description, 7);
        });

        if (Game.description) {
            EventBus.publish(events.onDescriptionChange);
        }
    }

    public clear(): void {
        this.parent.el.innerHTML = '';

        this.choiseButton.disactive();

        this.onDescriptionChange.unsubscribe();
    }
}

export default DescriptionPage;