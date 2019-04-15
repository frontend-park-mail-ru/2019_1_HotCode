'use strict';

import EventBus from '../../modules/event-bus';
import Component from '../baseComponent/index';
import {events} from '../../modules/utils/events';
import Checkbox from '../checkbox/checkbox';
import Button from '../button/button';

abstract class BaseGame extends Component{

    private progressBar: Component;
    private progress: Component;
    private pauseButtonInput: Checkbox;
    private pauseButton: Component;
    private stopButtonInput: Button;

    public framesCount: number;
    public counter: number;
    public pauseFlag: boolean;

    constructor(el: HTMLElement) {
        super(el);

        this.progressBar = new Component(this.el.querySelector('.play__item__content__walkmen__progress-bar'));
        this.progress = new Component(this.el.querySelector('.play__item__content__walkmen__progress'));

        this.progressBar.on('click', (e: MouseEvent) => {

            const placeClick = e.pageX - this.progressBar.el.getBoundingClientRect().left;
            this.counter = Math.floor(placeClick * this.framesCount / this.progressBar.el.clientWidth);
        });

        this.pauseButton = new Component(this.el.querySelector('.walkmen__item_theme_pause'));
        this.pauseButtonInput = new Checkbox(this.el.querySelector('#pause'),
            () => {

                this.pauseFlag = true;
                this.pauseButton.setText('►');
            },
            () => {

                EventBus.publish(events.onPause);
                this.pauseButton.setText('⏸');
            },
        );
        this.pauseButtonInput.onChange();

        this.stopButtonInput = new Button(this.el.querySelector('#stop'), () => {

            this.counter = this.framesCount - 1;
        });
        this.stopButtonInput.onClick();

        this.counter = 0;
        this.framesCount = 0;
        this.pauseFlag = false;

        EventBus.subscribe(events.onChangeProgress, () => {
            this.progress.el.style.width = this.progressBar.el.clientWidth / this.framesCount * this.counter + 'px';
        });
    }

    protected async init(states: any) {
        this.counter = this.framesCount;
        this.framesCount = states.states.length;
    }
}

export default BaseGame;