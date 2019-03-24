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

    getWidth(): number {
        return +this.el.style.width;
    }

    setWidth(value: number) {
        this.el.style.width = value.toString();
    }

    getHeight(): number {
        return +this.el.style.height;
    }

    setHeight(value: number) {
        this.el.style.height = value.toString();
    }
}

function sleep() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 10);
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

    public async render(states: {[key: string]: {[key: string]: number}}[]) {
        for(let state of states) {
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

        await sleep();
    }


}

export default PingPong;