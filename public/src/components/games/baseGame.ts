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

        const playAnim1 = new Component(this.el.querySelector('#playOn1'));
        const stopAnim1 = new Component(this.el.querySelector('#playOff1'));
        const playAnim2 = new Component(this.el.querySelector('#playOn2'));
        const stopAnim2 = new Component(this.el.querySelector('#playOff2'));
        this.pauseButtonInput = new Checkbox(this.el.querySelector('#pause'),
            () => {

                this.pauseFlag = true;
                (playAnim1.el as any).beginElement();
                (playAnim2.el as any).beginElement();
            },
            () => {

                EventBus.publish(events.onPause);
                (stopAnim1.el as any).beginElement();
                (stopAnim2.el as any).beginElement();
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