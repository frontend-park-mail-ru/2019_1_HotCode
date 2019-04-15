'use strict';

import Http from '../modules/http';
import Game from "../models/game";
import {gamePaths} from './utils/paths';

class GameService {

    public static getScores(slug: string, limit: number, offset: number): Promise<any> {

        return Http.Get(`${gamePaths.getScorePath}/${slug}/leaderboard?offset=${offset}&limit=${limit}`);
    }


    public static getCountUsers(slug: string): Promise<any> {

        return Http.Get(`${gamePaths.getCountUsersPath}/${slug}/leaderboard/count`);
    }


    public static getGames(): Promise<any> {

        return Http.Get(gamePaths.getGamesPath);
    }


    public static getGame(slug: string): Promise<any> {

        return Http.Get(`${gamePaths.getGamePath}/${slug}`)
            .then((resp) => {

                Game.slug = resp.slug;
                Game.title = resp.title;
                Game.backgrondUUID = resp.background_uuid;
                Game.logoUUID = resp.logo_uuid;
                Game.description = resp.description;
                Game.rules = resp.rules;
                Game.codeExample = resp.code_example;

                return resp;
            });
    }
}

export default GameService;