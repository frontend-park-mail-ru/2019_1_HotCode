'use strict';

import Component from '../baseComponent/index';

class SvgGameObject extends Component {

    private maxHealthField: number;

    constructor(el: HTMLElement) {
        super(el);
    }


    get maxHealth(): number {
        return this.maxHealthField;
    }

    set maxHealth(value: number) {
        this.maxHealthField = value;
    }

    public setHealth(value: number) {
        this.el.style.opacity = (value / this.maxHealthField).toString();
    }

    public getX(): any {
        return this.el.getAttribute('x');
    }

    public setX(value: string) {
        this.el.setAttribute('x', value);
    }

    public getY(): any {
        return this.el.getAttribute('y');
    }

    public setY(value: string) {
        this.el.setAttribute('y', value);
    }

    public getCX(): any {
        return this.el.getAttribute('cx');
    }

    public setCX(value: string) {
        this.el.setAttribute('cx', value);
    }

    public getCY(): any {
        return this.el.getAttribute('cy');
    }

    public setCY(value: string) {
        this.el.setAttribute('cy', value);
    }

    public getWidth(): string {
        return this.el.getAttribute('width');
    }

    public setWidth(value: string) {
        this.el.setAttribute('width', value);
    }

    public getHeight(): string {
        return this.el.getAttribute('height');
    }

    public setHeight(value: string) {
        this.el.setAttribute('height', value);
    }

    public getRadius(): string {
        return this.el.getAttribute('r');
    }

    public setRadius(value: string) {
        this.el.setAttribute('r', value);
    }

    public getX1(): any {
        return this.el.getAttribute('x1');
    }

    public setX1(value: string) {
        this.el.setAttribute('x1', value);
    }

    public getX2(): any {
        return this.el.getAttribute('x2');
    }

    public setX2(value: string) {
        this.el.setAttribute('x2', value);
    }

    public getY1(): any {
        return this.el.getAttribute('y1');
    }

    public setY1(value: string) {
        this.el.setAttribute('y1', value);
    }

    public getY2(): any {
        return this.el.getAttribute('y2');
    }

    public setY2(value: string) {
        this.el.setAttribute('y2', value);
    }
}

export default SvgGameObject;