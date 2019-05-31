'use strict';

import Player from './player';

class PlayablePlayer extends Player {
    constructor(p: Player) {
        super(p.x, p.y, p.height, p.width);
        this.vX = p.vX;
        this.vY = p.vY;
    }

    public setMoveVector(speed: number, x: number, y: number) {

        let nSpeed = speed / Math.sqrt(x * x + y * y);
        if (isNaN(nSpeed) || nSpeed === Infinity) {
            nSpeed = 0;
        }

        this.vX = x * nSpeed;
        this.vY = y * nSpeed;
    }
}

export default PlayablePlayer;