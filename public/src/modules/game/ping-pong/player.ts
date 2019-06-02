'use strict';

import GameObject from './gameObject';

class Player extends GameObject {
    public height: number;
    public width: number;

    constructor(x: number, y: number, height: number, width: number) {
        super(x, y, 0, 0);

        this.height = height;
        this.width = width;
    }
}

export default Player;