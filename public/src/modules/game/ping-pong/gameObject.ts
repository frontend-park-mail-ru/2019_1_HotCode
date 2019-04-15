'use strict';

class GameObject {
    public x: number;
    public y: number;

    public vX: number;
    public vY: number;
    constructor(x: number, y: number, vX: number, vY: number) {
        this.x = x;
        this.y = y;

        this.vX = vX;
        this.vY = vY;
    }
}

export default GameObject;