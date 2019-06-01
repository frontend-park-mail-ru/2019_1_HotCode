'use strict';

class GameConsole {
    public logs: string[];
    public logsTickCount: number;

    constructor() {
        this.logs = [];
        this.logsTickCount = 0;
    }

    public log(msg: string) {
        if (this.logsTickCount >= 10) {
            return;
        }

        if (msg.length > 150) {
            this.logs.push(msg.substr(0, 150));
        }
        this.logs.push(msg);
        this.logsTickCount++;
    }
}

export default GameConsole;