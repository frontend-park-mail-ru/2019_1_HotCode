'use strict';
import Console from '../../components/console/console';
import GameConsole from './console';
interface IGame {
    getInfo(): any;

    getState(): any;
    isDone(): number;

    getObjectsP1(): any[];
    getObjectsP2(): any[];

    saveObjects(p1: any, p2: any): void;

    setTicksLeft(l: number): void;
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

        let logs1 = new GameConsole();
        let logs2 = new GameConsole(); //TODO: убрать
        for (let tick = 0; tick < this.ticksCount; tick++) {
            this.game.setTicksLeft(this.ticksCount - tick);

            const p1Args = this.game.getObjectsP1();
            const p2Args = this.game.getObjectsP2();

            logs1.logsTickCount = 0;
            logs2.logsTickCount = 0;//TODO: убрать
            p1Args.push(logs1);
            p2Args.push(logs2);//TODO: убрать

            try {
                this.player1(...p1Args);
            } catch (err) {
                Console.createLog(`[TICK: ${tick}] ERROR: ${err.name}: ${err.message};`, true);
                winner = 2;
                break;
            }

            this.player2(...p2Args);

            this.game.saveObjects(p1Args, p2Args);
            ticks.push(this.game.getState());
            //console.log(this.game.getState());

            const res = this.game.isDone();
            //console.log(res);
            if (res !== -1) {
                winner = res;
                break;
            }
        }

        return {
            info: this.game.getInfo(),
            states: ticks,
            winner,
            logs: logs1.logs,
        };
    }
}

export default Tester;