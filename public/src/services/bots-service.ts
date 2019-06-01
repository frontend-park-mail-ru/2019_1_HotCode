'use strict';

import Http from '../modules/http';
import Match from "../models/match";
import {botsPaths, gamePaths} from './utils/paths';
import serverNames from '../modules/utils/serverNames';
import EventBus from '../modules/event-bus';
import {events} from '../modules/utils/events';

class BotsService {

    private static server: string = serverNames.botsBackend;

    public static getBots(slug: string): Promise<any> {

        return Http.Get(
            `${BotsService.server}${botsPaths.getBotsPath}?game_slug=${slug}`,
        );
    }

    public static getMoreBots(slug: string, since: number, limit: number): Promise<any> {

        return Http.Get(
            `${BotsService.server}${botsPaths.getMoreBotsPath}?game_slug=${slug}&since=${since}&limit=${limit}`,
        );
    }

    public static sendBots(game_slug: string, code: string, lang = 'JS'): Promise<any> {

        const body = {code, game_slug, lang};

        return Http.Post(
            `${BotsService.server}${botsPaths.sendBotsPath}`,
            body,
        );
    }

    public static getMatches(slug: string): Promise<any> {

        return Http.Get(
            `${BotsService.server}${botsPaths.getMatchesPath}?game_slug=${slug}`,
        );
    }

    public static getMoreMatches(slug: string, since: number, limit: number): Promise<any> {

        return Http.Get(
            `${BotsService.server}${botsPaths.getMoreMatchesPath}?game_slug=${slug}&since=${since}&limit=${limit}`,
        );
    }

    public static getUserMatches(user: string): Promise<any> {

        return Http.Get(
            `${BotsService.server}${botsPaths.getMatchesPath}?author=${user}`,
        );
    }

    public static getMoreUserMatches(user: string, since: number, limit: number): Promise<any> {

        return Http.Get(
            `${BotsService.server}${botsPaths.getMoreMatchesPath}?author=${user}&since=${since}&limit=${limit}`,
        );
    }

    public static getMatch(id: string): Promise<any> {

        return Http.Get(
            `${BotsService.server}${botsPaths.getMatchPath}/${id}`,
        ).then((resp) => {

            Match.code = resp.code;
            Match.replay = resp.replay;
            Match.result = resp.result;
            Match.date = resp.timestamp;
            Match.id = resp.id;
            Match.diff1 = resp.diff1;
            Match.diff2 = resp.diff2;
            Match.user1 = resp.author_1;
            Match.user2 = resp.author_2;
            Match.bot1_id = resp.bot1_id;
            Match.bot2_id = resp.bot2_id;
            Match.error = resp.error;

            EventBus.publish(events.onMatchLoad);

            return resp;
        });
    }

}

export default BotsService;