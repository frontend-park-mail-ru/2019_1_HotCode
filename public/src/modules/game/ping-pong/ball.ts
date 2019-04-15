'use strict';

import GameObject from './gameObject';

class Ball extends GameObject {
    public diameter: number;

    constructor(diameter: number, x: number, y: number, vX: number, vY: number) {
        super(x, y, vX, vY);
        this.diameter = diameter;
    }
}

export default Ball;