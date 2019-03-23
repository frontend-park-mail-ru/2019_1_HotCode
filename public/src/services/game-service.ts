'use strict';

import Http from '../modules/http';
import Game from "../models/game";
import {gamePaths} from './utils/paths';

class GameService {

    static getScores(id: number, limit: number, offset: number): Promise<any> {

        return Http.Get(`${gamePaths.getScorePath}/${id}/leaderboard?offset=${offset}&limit=${limit}`);
    }


    static getCountUsers(id: number): Promise<any> {

        return Http.Get(`${gamePaths.getCountUsersPath}/${id}/leaderboard/count`);
    }


    static getGames(): Promise<any> {

        return Http.Get(gamePaths.getGamesPath);
    }


    static getGame(id: number): Promise<any> {

        return Http.Get(`${gamePaths.getGamePath}/${id}`)
            .then(resp => {

                Game.id = resp.id;
                Game.name = resp.title;
                return resp;
            });
    }
}

export default GameService;