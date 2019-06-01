'use strict';

class GameInfo {
    public height: number;
    public width: number;
    public ticks_left: number;

    constructor(h: number, w: number, tl: number) {
        this.height = h;
        this.width = w;
        this.ticks_left = tl;
    }
}

export default GameInfo;