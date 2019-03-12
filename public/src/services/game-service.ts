'use strict';

import Http from '../modules/http';
import Paths from '../utils/pathConfig';
import Game from "../models/game";

class GameService {

    static getScores(id: number, limit: number, offset: number): Promise<any> {

        return Http.Get(`${Paths.paths.game}/${id}/leaderboard?offset=${offset}&limit=${limit}`);
    }


    static getCountUsers(id: number): Promise<any> {

        return Http.Get(`${Paths.paths.game}/${id}/leaderboard/count`);
    }


    static getGames(): Promise<any> {

        return Http.Get(Paths.paths.game);
    }


    static getGame(id: number): Promise<any> {

        return Http.Get(`${Paths.paths.game}/${id}`)
            .then(resp => {

                Game.id = resp.id;
                Game.name = resp.title;
                return resp;
            });
    }
}

export default GameService;