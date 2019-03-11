'use strict';

import Http from '../modules/http';
import Paths from '../modules/pathConfig';
import Game from "../models/game";

class GameService {

    static getScores(id, limit, offset) {
        return Http.Get(`${Paths.paths.game}/${id}/leaderboard?offset=${offset}&limit=${limit}`);
    }

    static getCountUsers(id) {
        return Http.Get(`${Paths.paths.game}/${id}/leaderboard/count`);
    }

    static getGames() {
        return Http.Get(Paths.paths.game);
    }

    static getGame(id) {
        return Http.Get(`${Paths.paths.game}/${id}`)
            .then(resp => {

                Game.id = resp.id;
                Game.name = resp.title;
                return resp;
            });
    }
}

export default GameService;