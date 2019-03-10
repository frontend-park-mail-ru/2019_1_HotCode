'use strict';

import Http from '../modules/http';
import Paths from '../modules/pathConfig';
import Game from "../models/game";

class GameService {

    static getScores(id, limit, offset, callback) {
        Http.Get(`${Paths.paths.game}/${id}/leaderboard?offset=${offset}&limit=${limit}`)
            .then(resp => {
                callback(null, resp);
            })
            .catch(err => {
                return callback(err, null);
            });
    }

    static getGames(callback) {
        Http.Get(Paths.paths.game)
            .then(resp => {
                callback(null, resp);
            })
            .catch(err => {
                return callback(err, null);
            });
    }

    static getGame(id, callback) {
        Http.Get(`${Paths.paths.game}/${id}`)
            .then(resp => {
                Game.id = resp.id;
                Game.name = resp.title;
                callback(null, resp);
            })
            .catch(err => {
                return callback(err, null);
            });
    }
}

export default GameService;