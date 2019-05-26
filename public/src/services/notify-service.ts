'use strict';

import {notifyWSPaths} from './utils/paths';
import serverNames from '../modules/utils/serverNames';
import WebSock from '../modules/webSocket';

class NotifyService {

    private static server: string = serverNames.notifyBackend;

    public static getNotify(): WebSock {

        return new WebSock(NotifyService.server + notifyWSPaths.getNotifyPath);
    }

}

export default NotifyService;