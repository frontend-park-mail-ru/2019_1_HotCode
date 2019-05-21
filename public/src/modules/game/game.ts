import Tester from './tester';
import PlayablePlayer from './ping-pong/playablePlayer';
import Player from './ping-pong/player';
import Ball from './ping-pong/ball';
import Game from './ping-pong/game';

export const runCode = (code: string, enemyCode: string) => {

    const p1 = new Function("me", "enemy", "ball", code);
    const p2 = new Function("me", "enemy", "ball", enemyCode);
    const g = new Game(250, 500);
    const t = new Tester(p1, p2, g, 10000);

    return t.run();
};