'use strict';

import Http from '../modules/http';
import Game from "../models/game";
import {gamePaths} from './utils/paths';
import serverNames from '../modules/utils/serverNames';

class GameService {

    private static server: string = serverNames.gameBackend;

    public static getScores(slug: string, limit: number, offset: number): Promise<any> {

        return Http.Get(
            `${GameService.server}${gamePaths.getScorePath}/${slug}/leaderboard?offset=${offset}&limit=${limit}`,
            );
    }


    public static getCountUsers(slug: string): Promise<any> {

        return Http.Get(
            `${GameService.server}${gamePaths.getCountUsersPath}/${slug}/leaderboard/count`,
            );
    }


    public static getGames(): Promise<any> {

        return Http.Get(GameService.server + gamePaths.getGamesPath);
    }


    public static getGame(slug: string): Promise<any> {

        return Http.Get(`${GameService.server}${gamePaths.getGamePath}/${slug}`)
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