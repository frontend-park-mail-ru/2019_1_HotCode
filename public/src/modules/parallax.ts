'use strict';


import Component from '../components/baseComponent/index';

class Parallax {

    private parallaxComponent: Component;

    private lFollowX: number;
    private lFollowY: number;
    private xPos: number;
    private yPos: number;
    private maxX: number;
    private maxY: number;
    private friction: number;

    private cancelId: number;

    constructor(comp: Component,
                maxX: number = 10,
                maxY: number = 10) {
        this.parallaxComponent = comp;

        this.xPos = 0;
        this.yPos = 0;
        this.lFollowY = 0;
        this.lFollowX = 0;
        this.maxX = maxX;
        this.maxY = maxY;
        this.friction = 1 / 30;
    }

    public moveBackground(): void {

        this.xPos += (this.lFollowX - this.xPos) * this.friction;
        this.yPos += (this.lFollowY - this.yPos) * this.friction;

        const transform = `translate(calc(-50% + ${this.xPos}px), calc(-50% + ${this.yPos}px))`;

        const elem = this.parallaxComponent.el;

        elem.style.transform = transform;

        requestAnimationFrame(() => {
            this.moveBackground();
        });

    }

    public degBackground(): void {

        this.xPos += (this.lFollowX - this.xPos) * this.friction;
        this.yPos += (this.lFollowY - this.yPos) * this.friction;

        const transform = `rotateX(${this.yPos}deg) rotateY(${this.xPos}deg) rotate(-16.34deg) translate(-50%,-50%)`;

        const elem = this.parallaxComponent.el;

        elem.style.transform = transform;

        requestAnimationFrame(() => {
            this.degBackground();
        });
    }

    public degMainBackground(): void {

        this.xPos += (this.lFollowX - this.xPos) * this.friction;
        this.yPos += (this.lFollowY - this.yPos) * this.friction;

        // let transform = `rotateX(${this.yPos}deg) rotateY(${this.xPos}deg)`;

        // const elem = this.parallaxComponent.el;

        this.parallaxComponent.el.style.transform = `rotateX(${this.yPos}deg) rotateY(${this.xPos}deg)`;

        this.cancelId = requestAnimationFrame(() => {
            this.degMainBackground();
        });
    }

    public offMouseMove() {
        cancelAnimationFrame(this.cancelId);
        this.parallaxComponent.el.style.transform = '';

        document.removeEventListener('mousemove',  this.mouseMoveCallback);
    }

    public onMouseMove(): void {
        document.addEventListener('mousemove', this.mouseMoveCallback);
    }

    private mouseMoveCallback = (e: MouseEvent) => {
        const fluidboxer = matchMedia('(min-width: 726px)');

        if (fluidboxer.matches) {
            const lMouseX = Math.max(-100, Math.min(100, innerWidth / 2 - e.clientX));
            const lMouseY = Math.max(-100, Math.min(100, innerHeight / 2 - e.clientY));
            this.lFollowX = (this.maxX * lMouseX) / 100;
            this.lFollowY = (this.maxY * lMouseY) / 100;
        }
    }
}

export default Parallax;