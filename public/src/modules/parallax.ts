'use strict';


import Component from '../components/baseComponent/index';

class Parallax {

    private parallaxComponent: Component;

    private lFollowX: number;
    private lFollowY: number;
    private xPos: number;
    private yPos: number;
    private friction: number;

    constructor(comp: Component) {
        this.parallaxComponent = comp;

        this.xPos = 0;
        this.yPos = 0;
        this.lFollowY = 0;
        this.lFollowX = 0;
        this.friction = 1 / 30;

        this.onMouseMove();
    }

    public moveBackground(): void {

        this.xPos += (this.lFollowX - this.xPos) * this.friction;
        this.yPos += (this.lFollowY - this.yPos) * this.friction;

        let translate = `translate(calc(-50% + ${this.xPos}px), calc(-50% + ${this.yPos}px))`;

        const elem = this.parallaxComponent.el;

        elem.style.transform = translate;

        requestAnimationFrame(() => {
            this.moveBackground();
        });

    }

    // public degBackground(): void {
    //
    //     this.xPos += (this.lFollowX - this.xPos) * this.friction;
    //     this.yPos += (this.lFollowY - this.yPos) * this.friction;
    //
    //     let translate = `rotateX(-12deg) rotateY(-12deg) rotate(-16.34deg) translate(-50%,-50%)`;
    //
    //     const elem = this.parallaxComponent.el;
    //
    //     elem.style.transform = translate;
    //
    //     requestAnimationFrame(() => {
    //         this.moveBackground();
    //     });
    // }

    private onMouseMove(): void {
        document.addEventListener('mousemove', e => {

            const fluidboxer = matchMedia('(min-width: 726px)');

            if (fluidboxer.matches) {
                let lMouseX = Math.max(-100, Math.min(100, innerWidth / 2 - e.clientX));
                let lMouseY = Math.max(-100, Math.min(100, innerHeight / 2 - e.clientY));
                this.lFollowX = (100 * lMouseX) / 100;
                this.lFollowY = (80 * lMouseY) / 100;
            }

        });
    }
}

export default Parallax;