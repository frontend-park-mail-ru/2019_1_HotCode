'use strict';

import {chatPaths} from './utils/paths';
import WebSock from '../modules/webSocket';

class ChatService {

    public static sendMessage(): WebSock {

        return new WebSock(chatPaths.sendMessagePath);
    }
}

export default ChatService;