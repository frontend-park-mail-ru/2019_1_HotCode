'use strict';

import Component from '../../baseComponent/index';

class GameObject extends Component {

    constructor(el: HTMLElement) {
        super(el);
    }


    getX(): any {
        return this.el.style.left;
    }

    setX(value: string) {
        this.el.style.left = value;
    }

    getY(): any {
        return this.el.style.top;
    }

    setY(value: string) {
        this.el.style.top = value;
    }

    getWidth(): string {
        return this.el.style.width;
    }

    setWidth(value: string) {
        this.el.style.width = value.toString();
    }

    getHeight(): string {
        return this.el.style.height;
    }

    setHeight(value: string) {
        this.el.style.height = value.toString();
    }
}

function sleep() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 500);
    });
}


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
        console.log('width', states.info.racket.w);
        console.log('height', states.info.racket.h);
        console.log('diameter',states.info.ball.diameter);
        this.player1.setWidth(`${states.info.racket.w * this.el.clientWidth}px`);
        this.player1.setHeight(`${states.info.racket.h * this.el.clientHeight}px`);
        this.player2.setWidth(`${states.info.racket.w * this.el.clientWidth}px`);
        this.player2.setHeight(`${states.info.racket.h * this.el.clientHeight}px`);

        this.ball.setWidth(`${states.info.ball.diameter * this.el.clientHeight}px`);
        this.ball.setHeight(`${states.info.ball.diameter * this.el.clientHeight}px`);

        for(let state of states.states) {
            await this.renderState(state);
        }
    }

    public async renderState(state: {[key: string]: {[key: string]: number}}) {
        console.log('x', state.ball.x);
        this.ball.setX(`${state.ball.x * this.el.clientWidth}px`);
        this.ball.setY(`${state.ball.y * this.el.clientHeight}px`);

        this.player1.setX(`${state.player_1.x * this.el.clientWidth}px`);
        this.player1.setY(`${state.player_1.y * this.el.clientHeight}px`);

        this.player2.setX(`${state.player_2.x * this.el.clientWidth}px`);
        this.player2.setY(`${state.player_2.y * this.el.clientHeight}px`);

        await sleep();
    }


}

export default PingPong;