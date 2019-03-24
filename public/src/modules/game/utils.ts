import { PlayablePlayer, Player, Ball, Game } from './gamePingPong';
import Tester from './tester';

export const runCode = (code: string) => {
    const bot = (me: PlayablePlayer, enemy: Player, ball: Ball) => {
        me.setMoveVector(1, 0, -1);
    };

    const p1 = new Function("me", "enemy", "ball", code);
    const g = new Game(250, 500);
    const t = new Tester(p1, bot, g, 10000);

    return t.run();
};