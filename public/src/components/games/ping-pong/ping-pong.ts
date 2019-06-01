'use strict';

import GameObject from '../gameObject';
import BaseGame from '../baseGame';
import Match from '../../../models/match';
import Console from '../../../components/console/console';
import EventBus from '../../../modules/event-bus';
import {events} from '../../../modules/utils/events';
import Component from '../../baseComponent/index';

class PingPong extends BaseGame{

    private player1Text: Component;
    private player2Text: Component;
    private player1: GameObject;
    private player2: GameObject;
    private ball: GameObject;

    private width: number;
    private height: number;

    private onPauseRemover: {[key: string]: () => void};

    constructor(el: HTMLElement) {
        super(el);

        this.ball = new GameObject(this.el.querySelector('.pong__ball'));
        this.player1 = new GameObject(this.el.querySelector('.pong__player1'));
        this.player2 = new GameObject(this.el.querySelector('.pong__player2'));
        this.player1Text = new Component(this.el.querySelector('.pong__player1__text'));
        this.player2Text = new Component(this.el.querySelector('.pong__player2__text'));

        if (Match.user1 && Match.user1.username) {
            this.player1Text.setText(Match.user1.username);
        }

        if (Match.user2 && Match.user2.username) {
            this.player2Text.setText(Match.user2.username);
        }

        this.width = +this.el.style.width;
        this.height = +this.el.style.height;
    }

    public async init(states: any) {
        super.init(states);

        if (this.onPauseRemover) {
            this.onPauseRemover.unsubscribe();
        }

        this.onPauseRemover = EventBus.subscribe(events.onPause, () => {
            this.render(states);
        });

        this.player1.setWidth(`${states.info.racket.w * this.el.clientWidth}px`);
        this.player1.setHeight(`${states.info.racket.h * this.el.clientHeight}px`);
        this.player2.setWidth(`${states.info.racket.w * this.el.clientWidth}px`);
        this.player2.setHeight(`${states.info.racket.h * this.el.clientHeight}px`);

        this.ball.setWidth(`${states.info.ball.diameter * this.el.clientHeight}px`);
        this.ball.setHeight(`${states.info.ball.diameter * this.el.clientHeight}px`);

        await PingPong.sleep();
        this.counter = 0;
        this.render(states);

    }

    public async render(states: any) {
        for (; this.counter < this.framesCount;) {

            if (this.pauseFlag) {
                this.pauseFlag = false;
                break;
            }

            await this.renderState(states.states[this.counter]);
            EventBus.publish(events.onChangeProgress);
            this.counter++;
        }
    }

    public async renderState(state: {[key: string]: any}) {
        this.ball.setX(`${state.ball.x * this.el.clientWidth}px`);
        this.ball.setY(`${state.ball.y * this.el.clientHeight}px`);

        this.player1.setX(`${state.player_1.x * this.el.clientWidth}px`);
        this.player1.setY(`${state.player_1.y * this.el.clientHeight}px`);

        this.player2.setX(`${state.player_2.x * this.el.clientWidth}px`);
        this.player2.setY(`${state.player_2.y * this.el.clientHeight}px`);

        await PingPong.sleep();
    }

    private static sleep() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 10);
        });
    }
}

export default PingPong;