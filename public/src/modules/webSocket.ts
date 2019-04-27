'use strict';

import serverNames from './utils/serverNames';

class WebSock {

    private static server: string = serverNames.WSbackend;

    private wsField: WebSocket;

    constructor(path: string) {

        const uri = WebSock.server + path;

        this.wsField = new WebSocket(uri);
    }

    public send(data: any) {
        console.log(data);
        data = JSON.stringify(data);
        console.log(data);

        this.wsField.send(data);
    }

    public open(
        onMessage: (p?: any) => void,
        onError: (p?: any) => void,
        ): void {

        this.wsField.onopen = () => {

            this.wsField.onmessage = (event) => {
                onMessage(JSON.parse(event.data));
            };

            this.wsField.onclose = (event) => {
                if (event.wasClean) {
                    onMessage();
                } else {
                    onError(event.reason);
                }
            };
        }
    }
}

export default WebSock;