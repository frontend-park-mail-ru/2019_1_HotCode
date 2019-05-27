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
        onOpen: (p?: any) => void,
        onMessage: (p?: any) => void,
        onError: (p?: any) => void,
        ): void {

        this.wsField.onopen = () => {

            onOpen();

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