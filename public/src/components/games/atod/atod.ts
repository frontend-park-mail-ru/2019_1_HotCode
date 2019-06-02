'use strict';

import GameObject from '../gameObject';
import BaseGame from '../baseGame';
import Match from '../../../models/match';
import Console from '../../../components/console/console';
import EventBus from '../../../modules/event-bus';
import {events} from '../../../modules/utils/events';
import Component from '../../baseComponent/index';
import SvgGameObject from '../svgGameObject';

class Atod extends BaseGame{

    private player1Text: Component;
    private player2Text: Component;

    private atodSvg: Component;

    private dropzoneMe: SvgGameObject;
    private dropzoneEnemy: SvgGameObject;

    private player1Tank: SvgGameObject;
    private player1Healer: SvgGameObject;
    private player1Sniper: SvgGameObject;
    private player1DD1: SvgGameObject;
    private player1DD2: SvgGameObject;

    private player2Tank: SvgGameObject;
    private player2Healer: SvgGameObject;
    private player2Sniper: SvgGameObject;
    private player2DD1: SvgGameObject;
    private player2DD2: SvgGameObject;

    private flagsMe: SvgGameObject[];

    private flagsEnemy: SvgGameObject[];

    private obstacles: SvgGameObject[];
    private projectiles: SvgGameObject[];

    private width: number;
    private height: number;

    private onPauseRemover: {[key: string]: () => void};

    constructor(el: HTMLElement) {
        super(el);

        this.width = 1000;
        this.height = 500;

        this.atodSvg = new Component(this.el.querySelector('.atod'));

        this.dropzoneMe = new SvgGameObject(this.el.querySelector('.atod__dropzone_me'));
        this.dropzoneEnemy = new SvgGameObject(this.el.querySelector('.atod__dropzone_enemy'));

        this.player1Tank = new SvgGameObject(this.el.querySelector('.atod__tank.atod__player1'));
        this.player1Healer = new SvgGameObject(this.el.querySelector('.atod__healer.atod__player1'));
        this.player1Sniper = new SvgGameObject(this.el.querySelector('.atod__sniper.atod__player1'));
        this.player1DD1 = new SvgGameObject(this.el.querySelector('.atod__dd1.atod__player1'));
        this.player1DD2 = new SvgGameObject(this.el.querySelector('.atod__dd2.atod__player1'));

        this.player2Tank = new SvgGameObject(this.el.querySelector('.atod__tank.atod__player2'));
        this.player2Healer = new SvgGameObject(this.el.querySelector('.atod__healer.atod__player2'));
        this.player2Sniper = new SvgGameObject(this.el.querySelector('.atod__sniper.atod__player2'));
        this.player2DD1 = new SvgGameObject(this.el.querySelector('.atod__dd1.atod__player2'));
        this.player2DD2 = new SvgGameObject(this.el.querySelector('.atod__dd2.atod__player2'));

        this.flagsMe = Array.from(this.el.querySelectorAll('.atod__flag_me'))
            .map((flag) => new SvgGameObject(flag as HTMLElement));

        this.flagsEnemy = Array.from(this.el.querySelectorAll('.atod__flag_enemy'))
            .map((flag) => new SvgGameObject(flag as HTMLElement));

        if (this.obstacles && this.obstacles.length > 0) {
            this.obstacles.forEach((obstacle) => {

                obstacle.el.parentElement.removeChild(obstacle.el);
            })
        }
        this.obstacles = [];
        this.projectiles = [];

        this.player1Text = new Component(this.el.querySelector('.atod__player1__text'));
        this.player2Text = new Component(this.el.querySelector('.atod__player2__text'));

        if (Match.user1 && Match.user1.username) {
            this.player1Text.setText(Match.user1.username);
        }

        if (Match.user2 && Match.user2.username) {
            this.player2Text.setText(Match.user2.username);
        }

    }

    public async init(states: any) {
        super.init(states);

        if (this.onPauseRemover) {
            this.onPauseRemover.unsubscribe();
        }

        this.onPauseRemover = EventBus.subscribe(events.onPause, () => {
            this.render(states);
        });

        this.dropzoneMe.setRadius(`${states.info.p1_dropzone.radius * this.height}`);
        this.dropzoneMe.setCX(`${states.info.p1_dropzone.x * this.width}`);
        this.dropzoneMe.setCY(`${states.info.p1_dropzone.y * this.height}`);

        this.dropzoneEnemy.setRadius(`${states.info.p2_dropzone.radius * this.height}`);
        this.dropzoneEnemy.setCX(`${states.info.p2_dropzone.x * this.width}`);
        this.dropzoneEnemy.setCY(`${states.info.p2_dropzone.y * this.height}`);

        states.states[0].p1_units.map((unit: {[key: string]: any}) => {

            if (unit.unit_type === 'tank') {
                this.player1Tank.maxHealth = unit.health;

            } else if (unit.unit_type === 'sniper') {

                this.player1Sniper.maxHealth = unit.health;

            } else if (unit.unit_type === 'medic') {

                this.player1Healer.maxHealth = unit.health;

            } else if (unit.unit_type === 'soldier1') {

                this.player1DD1.maxHealth = unit.health;

            } else if (unit.unit_type === 'soldier2') {

                this.player1DD2.maxHealth = unit.health;
            }

        });

        states.states[0].p2_units.map((unit: {[key: string]: any}) => {

            if (unit.unit_type === 'tank') {
                this.player2Tank.maxHealth = unit.health;

            } else if (unit.unit_type === 'sniper') {

                this.player2Sniper.maxHealth = unit.health;

            } else if (unit.unit_type === 'medic') {

                this.player2Healer.maxHealth = unit.health;

            } else if (unit.unit_type === 'soldier1') {

                this.player2DD1.maxHealth = unit.health;

            } else if (unit.unit_type === 'soldier2') {

                this.player2DD2.maxHealth = unit.health;
            }

        });

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
                const newObst = Component.CreateSVGElem('rect', ['atod__obstacle']);
                this.atodSvg.el.appendChild(newObst);
                this.obstacles[i] = new SvgGameObject(newObst as Element as HTMLElement);
            }

            this.obstacles[i].setX(`${obstacle.x * this.width - obstacle.width * this.width / 2}`);
            this.obstacles[i].setY(`${obstacle.y * this.height - obstacle.height * this.height / 2}`);
            this.obstacles[i].setWidth(`${obstacle.width * this.width}`);
            this.obstacles[i].setHeight(`${obstacle.height * this.height}`);

        });

        let indexOfProjectiles = 0;

        state.projectiles.map((projectile: {[key: string]: any}, i: number) => {

            if (!this.projectiles[i]) {
                const newProj = Component.CreateSVGElem('line', ['atod__line']);
                this.atodSvg.el.appendChild(newProj);
                this.projectiles[i] = new SvgGameObject(newProj as Element as HTMLElement);
            }

            this.projectiles[i].show();
            this.projectiles[i].setX1(`${projectile.x * this.width}`);
            this.projectiles[i].setY1(`${projectile.y * this.height}`);
            this.projectiles[i].setX2(`${projectile.x * this.width + projectile.vX * this.width}`);
            this.projectiles[i].setY2(`${projectile.y * this.height + projectile.vY * this.height}`);

            indexOfProjectiles = ++i;

        });

        for (;indexOfProjectiles < this.projectiles.length; indexOfProjectiles++) {

            this.projectiles[indexOfProjectiles].hide();
        }

        state.p1_units.map((unit: {[key: string]: any}) => {

            if (unit.unit_type === 'tank') {
                this.player1Tank.setCX(`${unit.x * this.width}`);
                this.player1Tank.setCY(`${unit.y * this.height}`);
                this.player1Tank.setRadius(`${unit.radius * this.height}`);
                this.player1Tank.setHealth(unit.health);

            } else if (unit.unit_type === 'sniper') {

                this.player1Sniper.setCX(`${unit.x * this.width}`);
                this.player1Sniper.setCY(`${unit.y * this.height}`);
                this.player1Sniper.setRadius(`${unit.radius * this.height}`);
                this.player1Sniper.setHealth(unit.health);

            } else if (unit.unit_type === 'medic') {

                this.player1Healer.setCX(`${unit.x * this.width}`);
                this.player1Healer.setCY(`${unit.y * this.height}`);
                this.player1Healer.setRadius(`${unit.radius * this.height}`);
                this.player1Healer.setHealth(unit.health);

            } else if (unit.unit_type === 'soldier1') {

                this.player1DD1.setCX(`${unit.x * this.width}`);
                this.player1DD1.setCY(`${unit.y * this.height}`);
                this.player1DD1.setRadius(`${unit.radius * this.height}`);
                this.player1DD1.setHealth(unit.health);

            } else if (unit.unit_type === 'soldier2') {

                this.player1DD2.setCX(`${unit.x * this.width}`);
                this.player1DD2.setCY(`${unit.y * this.height}`);
                this.player1DD2.setRadius(`${unit.radius * this.height}`);
                this.player1DD2.setHealth(unit.health);
            }

        });

        state.p2_units.map((unit: {[key: string]: any}) => {

            if (unit.unit_type === 'tank') {
                this.player2Tank.setCX(`${unit.x * this.width}`);
                this.player2Tank.setCY(`${unit.y * this.height}`);
                this.player2Tank.setRadius(`${unit.radius * this.height}`);
                this.player2Tank.setHealth(unit.health);

            } else if (unit.unit_type === 'sniper') {

                this.player2Sniper.setCX(`${unit.x * this.width}`);
                this.player2Sniper.setCY(`${unit.y * this.height}`);
                this.player2Sniper.setRadius(`${unit.radius * this.height}`);
                this.player2Sniper.setHealth(unit.health);

            } else if (unit.unit_type === 'medic') {

                this.player2Healer.setCX(`${unit.x * this.width}`);
                this.player2Healer.setCY(`${unit.y * this.height}`);
                this.player2Healer.setRadius(`${unit.radius * this.height}`);
                this.player2Healer.setHealth(unit.health);

            } else if (unit.unit_type === 'soldier1') {

                this.player2DD1.setCX(`${unit.x * this.width}`);
                this.player2DD1.setCY(`${unit.y * this.height}`);
                this.player2DD1.setRadius(`${unit.radius * this.height}`);
                this.player2DD1.setHealth(unit.health);

            } else if (unit.unit_type === 'soldier2') {

                this.player2DD2.setCX(`${unit.x * this.width}`);
                this.player2DD2.setCY(`${unit.y * this.height}`);
                this.player2DD2.setRadius(`${unit.radius * this.height}`);
                this.player2DD2.setHealth(unit.health);
            }

        });

        for (let i = 0; i < 2; i++) {

            if (state.p1_flags[i]) {

                this.flagsMe[i].setX(`${state.p1_flags[i].x * this.width - 10}`);
                this.flagsMe[i].setY(`${state.p1_flags[i].y * this.height - 10}`);

            } else {

                this.flagsMe[i].hide();
                this.flagsMe[i].hide();
            }
        }

        for (let i = 0; i < 2; i++) {

            if (state.p2_flags[i]) {

                this.flagsEnemy[i].setX(`${state.p2_flags[i].x * this.width - 10}`);
                this.flagsEnemy[i].setY(`${state.p2_flags[i].y * this.height - 10}`);

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