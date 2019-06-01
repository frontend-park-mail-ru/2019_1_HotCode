import Tester from './tester';
import PlayablePlayer from './ping-pong/playablePlayer';
import Player from './ping-pong/player';
import Ball from './ping-pong/ball';
import PongGame from './ping-pong/game';
import * as Atod from './atod/std_init';
import Alert from '../../components/alert/alert';

export const runCode = (game_slug: string, code: string, enemyCode: string) => {

    let t
    if (game_slug === "pong") {
        const p1 = new Function("me", "enemy", "ball", "game", "memory", code);
        const p2 = new Function("me", "enemy", "ball", "game", "memory", enemyCode);
        const g = new PongGame(250, 500);
        t = new Tester(p1, p2, g, 10000);
    } else if (game_slug === "2atod") {
        const p1 = new Function("units", "enemy_units", "dropzone", "enemy_dropzone", "flags",
            "enemy_flags", "obstacles", "projectiles", "game", code);
        const p2 = new Function("units", "enemy_units", "dropzone", "enemy_dropzone", "flags",
            "enemy_flags", "obstacles", "projectiles", "game", code);
        const g = Atod.stdField();
        t = new Tester(p1, p2, g, 10000);
    } else {
        Alert.alert('poszaluista ne lomai(((', false, 100000)
    }


    return t.run();
};