'use strict';

import Component from '../baseComponent/index';

class GameObject extends Component {

    constructor(el: HTMLElement) {
        super(el);
    }

    public getX(): any {
        return this.el.style.left;
    }

    public setX(value: string) {
        this.el.style.left = value;
    }

    public getY(): any {
        return this.el.style.top;
    }

    public setY(value: string) {
        this.el.style.top = value;
    }

    public getWidth(): string {
        return this.el.style.width;
    }

    public setWidth(value: string) {
        this.el.style.width = value.toString();
    }

    public getHeight(): string {
        return this.el.style.height;
    }

    public setHeight(value: string) {
        this.el.style.height = value.toString();
    }
}

export default GameObject;