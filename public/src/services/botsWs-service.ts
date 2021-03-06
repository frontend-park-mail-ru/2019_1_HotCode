'use strict';

import Game from "../models/game";
import {botsWSPaths} from './utils/paths';
import serverNames from '../modules/utils/serverNames';
import EventBus from '../modules/event-bus';
import {events} from '../modules/utils/events';
import WebSock from '../modules/webSocket';

class BotsWsService {

    private static server: string = serverNames.botsWSBackend;

    public static updateBots(): WebSock {

        return new WebSock(BotsWsService.server + botsWSPaths.updateBotsPath);
    }

}

export default BotsWsService;