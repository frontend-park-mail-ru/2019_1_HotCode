'use strict';

import Component from '../../baseComponent/index';
import GameObject from '../gameObject';

class PingPong extends Component{

    private player1: GameObject;
    private player2: GameObject;
    private ball: GameObject;

    private width: number;
    private height: number;

    constructor(el: HTMLElement) {
        super(el);

        this.ball = new GameObject(this.el.querySelector('.ping-pong__ball'));
        this.player1 = new GameObject(this.el.querySelector('.ping-pong__player1'));
        this.player2 = new GameObject(this.el.querySelector('.ping-pong__player2'));

        this.width = +this.el.style.width;
        this.height = +this.el.style.height;
    }

    public async render(states: any) {
        this.player1.setWidth(`${states.info.racket.w * this.el.clientWidth}px`);
        this.player1.setHeight(`${states.info.racket.h * this.el.clientHeight}px`);
        this.player2.setWidth(`${states.info.racket.w * this.el.clientWidth}px`);
        this.player2.setHeight(`${states.info.racket.h * this.el.clientHeight}px`);

        this.ball.setWidth(`${states.info.ball.diameter * this.el.clientHeight}px`);
        this.ball.setHeight(`${states.info.ball.diameter * this.el.clientHeight}px`);

        for (const state of states.states) {
            await this.renderState(state);
        }
    }

    public async renderState(state: {[key: string]: {[key: string]: number}}) {
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