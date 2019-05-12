'use strict';

import Http from '../modules/http';
import Game from "../models/game";
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

    public static sendBots(game_slug: string, code: string, lang = 'JS'): Promise<any> {

        const body = {code, game_slug, lang};

        return Http.Post(
            `${BotsService.server}${botsPaths.sendBotsPath}`,
            body,
        );
    }

}

export default BotsService;