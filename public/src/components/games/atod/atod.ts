'use strict';

import GameObject from '../gameObject';
import BaseGame from '../baseGame';
import Match from '../../../models/match';
import Console from '../../../components/console/console';
import EventBus from '../../../modules/event-bus';
import {events} from '../../../modules/utils/events';
import Component from '../../baseComponent/index';

class Atod extends BaseGame{

    private player1Text: Component;
    private player2Text: Component;

    private dropzoneMe: GameObject;
    private dropzoneEnemy: GameObject;

    private player1Tank: GameObject;
    private player1Healer: GameObject;
    private player1Sniper: GameObject;
    private player1DD1: GameObject;
    private player1DD2: GameObject;

    private player2Tank: GameObject;
    private player2Healer: GameObject;
    private player2Sniper: GameObject;
    private player2DD1: GameObject;
    private player2DD2: GameObject;

    private flagsMe: GameObject[];

    private flagsEnemy: GameObject[];

    private obstacles: GameObject[];

    private width: number;
    private height: number;

    private onPauseRemover: {[key: string]: () => void};

    constructor(el: HTMLElement) {
        super(el);

        this.dropzoneMe = new GameObject(this.el.querySelector('.atod__dropzone_me'));
        this.dropzoneEnemy = new GameObject(this.el.querySelector('.atod__dropzone_enemy'));

        this.player1Tank = new GameObject(this.el.querySelector('.atod__tank.atod__player1'));
        this.player1Healer = new GameObject(this.el.querySelector('.atod__healer.atod__player1'));
        this.player1Sniper = new GameObject(this.el.querySelector('.atod__sniper.atod__player1'));
        this.player1DD1 = new GameObject(this.el.querySelector('.atod__dd1.atod__player1'));
        this.player1DD2 = new GameObject(this.el.querySelector('.atod__dd2.atod__player1'));

        this.player2Tank = new GameObject(this.el.querySelector('.atod__tank.atod__player2'));
        this.player2Healer = new GameObject(this.el.querySelector('.atod__healer.atod__player2'));
        this.player2Sniper = new GameObject(this.el.querySelector('.atod__sniper.atod__player2'));
        this.player2DD1 = new GameObject(this.el.querySelector('.atod__dd1.atod__player2'));
        this.player2DD2 = new GameObject(this.el.querySelector('.atod__dd2.atod__player2'));

        this.flagsMe = Array.from(this.el.querySelectorAll('.atod__flag_me'))
            .map((flag) => new GameObject(flag as HTMLElement));

        this.flagsEnemy = Array.from(this.el.querySelectorAll('.atod__flag_enemy'))
            .map((flag) => new GameObject(flag as HTMLElement));

        if (this.obstacles && this.obstacles.length > 0) {
            this.obstacles.forEach((obstacle) => {

                obstacle.el.parentElement.removeChild(obstacle.el);
            })
        }
        this.obstacles = [];

        this.player1Text = new Component(this.el.querySelector('.atod__player1__text'));
        this.player2Text = new Component(this.el.querySelector('.atod__player2__text'));

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

        this.dropzoneMe.setWidth(`${states.info.p1_dropzone.radius * this.el.clientHeight}px`);
        this.dropzoneMe.setHeight(`${states.info.p1_dropzone.radius * this.el.clientHeight}px`);
        this.dropzoneMe.setX(`${states.info.p1_dropzone.x * this.el.clientWidth}px`);
        this.dropzoneMe.setY(`${states.info.p1_dropzone.y * this.el.clientHeight}px`);

        this.dropzoneEnemy.setWidth(`${states.info.p2_dropzone.radius * this.el.clientHeight}px`);
        this.dropzoneEnemy.setHeight(`${states.info.p2_dropzone.radius * this.el.clientHeight}px`);
        this.dropzoneEnemy.setX(`${states.info.p2_dropzone.x * this.el.clientWidth}px`);
        this.dropzoneEnemy.setY(`${states.info.p2_dropzone.y * this.el.clientHeight}px`);

        this.flagsMe.forEach((flag) => {

            flag.show();
        });

        this.flagsEnemy.forEach((flag) => {

            flag.show();
        });

        await Atod.sleep();
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

        state.obstacles.map((obstacle: {[key: string]: any}, i: number) => {

            if (!this.obstacles[i]) {
                const newObst = Component.Create('div', ['atod__obstacle']);
                this.append(newObst);
                this.obstacles[i] = new GameObject(newObst.el);
            }
            this.obstacles[i].setX(`${obstacle.x * this.el.clientWidth}px`);
            this.obstacles[i].setY(`${obstacle.y * this.el.clientHeight}px`);
            this.obstacles[i].setWidth(`${obstacle.width * this.el.clientWidth}px`);
            this.obstacles[i].setHeight(`${obstacle.height * this.el.clientHeight}px`);
        });

        state.p1_units.map((unit: {[key: string]: any}) => {

            if (unit.unit_type === 'tank') {
                this.player1Tank.setX(`${unit.x * this.el.clientWidth}px`);
                this.player1Tank.setY(`${unit.y * this.el.clientHeight}px`);
                this.player1Tank.setWidth(`${unit.radius * 2 * this.el.clientHeight}px`);
                this.player1Tank.setHeight(`${unit.radius * 2 * this.el.clientHeight}px`);

            } else if (unit.unit_type === 'sniper') {

                this.player1Sniper.setX(`${unit.x * this.el.clientWidth}px`);
                this.player1Sniper.setY(`${unit.y * this.el.clientHeight}px`);
                this.player1Sniper.setWidth(`${unit.radius * 2 * this.el.clientHeight}px`);
                this.player1Sniper.setHeight(`${unit.radius * 2 * this.el.clientHeight}px`);

            } else if (unit.unit_type === 'medic') {

                this.player1Healer.setX(`${unit.x * this.el.clientWidth}px`);
                this.player1Healer.setY(`${unit.y * this.el.clientHeight}px`);
                this.player1Healer.setWidth(`${unit.radius * 2 * this.el.clientHeight}px`);
                this.player1Healer.setHeight(`${unit.radius * 2 * this.el.clientHeight}px`);

            } else if (unit.unit_type === 'soldier1') {

                this.player1DD1.setX(`${unit.x * this.el.clientWidth}px`);
                this.player1DD1.setY(`${unit.y * this.el.clientHeight}px`);
                this.player1DD1.setWidth(`${unit.radius * 2 * this.el.clientHeight}px`);
                this.player1DD1.setHeight(`${unit.radius * 2 * this.el.clientHeight}px`);

            } else if (unit.unit_type === 'soldier2') {

                this.player1DD2.setX(`${unit.x * this.el.clientWidth}px`);
                this.player1DD2.setY(`${unit.y * this.el.clientHeight}px`);
                this.player1DD2.setWidth(`${unit.radius * 2 * this.el.clientHeight}px`);
                this.player1DD2.setHeight(`${unit.radius * 2 * this.el.clientHeight}px`);
            }

        });


        state.p2_units.map((unit: {[key: string]: any}) => {

            if (unit.unit_type === 'tank') {
                this.player2Tank.setX(`${unit.x * this.el.clientWidth}px`);
                this.player2Tank.setY(`${unit.y * this.el.clientHeight}px`);
                this.player2Tank.setWidth(`${unit.radius * 2 * this.el.clientHeight}px`);
                this.player2Tank.setHeight(`${unit.radius * 2 * this.el.clientHeight}px`);

            } else if (unit.unit_type === 'sniper') {

                this.player2Sniper.setX(`${unit.x * this.el.clientWidth}px`);
                this.player2Sniper.setY(`${unit.y * this.el.clientHeight}px`);
                this.player2Sniper.setWidth(`${unit.radius * 2 * this.el.clientHeight}px`);
                this.player2Sniper.setHeight(`${unit.radius * 2 * this.el.clientHeight}px`);

            } else if (unit.unit_type === 'medic') {

                this.player2Healer.setX(`${unit.x * this.el.clientWidth}px`);
                this.player2Healer.setY(`${unit.y * this.el.clientHeight}px`);
                this.player2Healer.setWidth(`${unit.radius * 2 * this.el.clientHeight}px`);
                this.player2Healer.setHeight(`${unit.radius * 2 * this.el.clientHeight}px`);

            } else if (unit.unit_type === 'soldier1') {

                this.player2DD1.setX(`${unit.x * this.el.clientWidth}px`);
                this.player2DD1.setY(`${unit.y * this.el.clientHeight}px`);
                this.player2DD1.setWidth(`${unit.radius * 2 * this.el.clientHeight}px`);
                this.player2DD1.setHeight(`${unit.radius * 2 * this.el.clientHeight}px`);

            } else if (unit.unit_type === 'soldier2') {

                this.player2DD2.setX(`${unit.x * this.el.clientWidth}px`);
                this.player2DD2.setY(`${unit.y * this.el.clientHeight}px`);
                this.player2DD2.setWidth(`${unit.radius * 2 * this.el.clientHeight}px`);
                this.player2DD2.setHeight(`${unit.radius * 2 * this.el.clientHeight}px`);
            }

        });

        for (let i = 0; i < 2; i++) {

            if (state.p1_flags[i]) {

                this.flagsMe[i].setX(`${state.p1_flags[i].x * this.el.clientWidth}px`);
                this.flagsMe[i].setY(`${state.p1_flags[i].y * this.el.clientHeight}px`);

            } else {

                this.flagsMe[i].hide();
                this.flagsMe[i].hide();
            }
        }

        for (let i = 0; i < 2; i++) {

            if (state.p2_flags[i]) {

                this.flagsEnemy[i].setX(`${state.p2_flags[i].x * this.el.clientWidth}px`);
                this.flagsEnemy[i].setY(`${state.p2_flags[i].y * this.el.clientHeight}px`);

            } else {

                this.flagsEnemy[i].hide();
                this.flagsEnemy[i].hide();
            }
        }

        await Atod.sleep();
    }

    private static sleep() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 10);
        });
    }
}

export default Atod;