import { Ball, Game, PlayablePlayer, Player } from './gamePingPong';
import Tester from './tester';

export const runCode = (code: string) => {
    const bot = (me: PlayablePlayer, enemy: Player, ball: Ball) => {
        const dx = ball.x - me.x;
        const dy = ball.y - me.y;


        me.setMoveVector(5, dx, dy);
};

    const p1 = new Function("me", "enemy", "ball", code);
    const g = new Game(250, 500);
    const t = new Tester(p1, bot, g, 10000);

    return t.run();
};