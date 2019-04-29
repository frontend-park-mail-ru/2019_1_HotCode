'use strict';

import {chatPaths} from './utils/paths';
import WebSock from '../modules/webSocket';
import serverNames from '../modules/utils/serverNames';

class ChatService {

    private static server: string = serverNames.chatBackend;

    public static sendMessage(): WebSock {

        return new WebSock(ChatService.server + chatPaths.sendMessagePath);
    }
}

export default ChatService;