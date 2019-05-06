'use strict';

interface IGame {
    getInfo(): any;

    getState(): any;
    isDone(): number;

    getObjectsP1(): any[];
    getObjectsP2(): any[];

    saveObjects(p1: any, p2: any): void;
}

class Tester {

    private game: IGame;
    private ticksCount: number;
    private player1: Function;
    private player2: Function;

    constructor(p1: Function, p2: Function, g: IGame, count: number) {
        this.player1 = p1;
        this.player2 = p2;
        this.ticksCount = count;
        this.game = g;
    }

    public run(): any {
        let winner = 0; // 0 это ничья
        const ticks = [];
        for (let tick = 0; tick < this.ticksCount; tick++) {
            const p1Args = this.game.getObjectsP1();
            const p2Args = this.game.getObjectsP2();

            this.player1(...p1Args);
            this.player2(...p2Args);

            this.game.saveObjects(p1Args, p2Args);
            ticks.push(this.game.getState());
            //console.log(this.game.getState());

            const res = this.game.isDone();
            //console.log(res);
            if (res !== 0) {
                winner = res;
                break;
            }
        }

        return {
            info: this.game.getInfo(),
            states: ticks,
            winner,
        };
    }
}

export default Tester;