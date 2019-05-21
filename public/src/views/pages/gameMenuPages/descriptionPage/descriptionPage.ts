'use strict';

import Component from "../../../../components/baseComponent/index";
import Page from '../../page';
import Game from "../../../../models/game";
import EventBus from '../../../../modules/event-bus';
import {events} from '../../../../modules/utils/events';

class DescriptionPage extends Page{

    private static template = require('./descriptionPage.pug');

    private onDescriptionChange: {[key: string]: () => void};

    constructor(parent: Component) {
        super(parent, 'Description - Game - WarScript');
    }

    public render(): void {

        super.render();
        this.renderTmpl(DescriptionPage.template);

        this.onDescriptionChange = EventBus.subscribe(events.onDescriptionChange, () => {

            new Component(this.parent.el.querySelector('.description-content'))
                .setTextAnim(Game.description, 7);
        });

        if (Game.description) {
            EventBus.publish(events.onDescriptionChange);
        }
    }

    public clear(): void {
        this.parent.el.innerHTML = '';
        this.onDescriptionChange.unsubscribe();
    }
}

export default DescriptionPage;