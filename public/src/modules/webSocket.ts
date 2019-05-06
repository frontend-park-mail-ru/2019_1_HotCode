'use strict';

class WebSock {

    private wsField: WebSocket;

    constructor(uri: string) {

        this.wsField = new WebSocket(uri);
    }

    public send(data: any) {
        data = JSON.stringify(data);

        this.wsField.send(data);
    }

    public open(
        onMessage: (p?: any) => void,
        onError: (p?: any) => void,
        ): void {

        this.wsField.onopen = () => {

            this.send(
                {
                    type: 'messages',
                    chat_id: 1,
                    payload: {
                        limit: 1000,
                        offset: 0,
                    },
                }
            );

            this.wsField.onmessage = (event) => {
                onMessage(JSON.parse(event.data));
            };

            this.wsField.onclose = (event) => {
                if (event.wasClean) {
                    onError();
                } else {
                    onError(event.reason);
                }
            };
        }
    }

    public close(): void {
        this.wsField.onmessage = null;
        this.wsField.close();
    }
}

export default WebSock;