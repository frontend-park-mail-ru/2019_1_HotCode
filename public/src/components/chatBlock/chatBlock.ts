'use strict';

import Component from '../baseComponent/index';
import ChatService from '../../services/chat-service';
import Message from './message/message';
import ScrollableBlock from '../scrollable/scrollable';
import WebSock from '../../modules/webSocket';

class ChatBlock extends Component {

    private messageBlock: Component;
    private sendText: Component;
    private sendForm: Component;

    private ws: WebSock;

    private static template = require('./chatBlock.pug');

    constructor() {
        const alertContainer = Component.Create('div', ['chat', 'chat_direction_top-right']);
        document.body.insertBefore(alertContainer.el, document.body.firstChild);

        super(document.querySelector('.chat'));
    }

    public render(): void {
        this.el.innerHTML = ChatBlock.template();

        const messageBlockContent = new ScrollableBlock(this.el.querySelector('.chat__main'));
        messageBlockContent.decorate();

        this.messageBlock = new Component(this.el.querySelector('.scrollable__content'));

        this.sendText = new Component(this.el.querySelector('.chat__field__input'));

        this.sendForm = new Component(this.el.querySelector('.form_theme_chat'));

        this.ws = ChatService.sendMessage();
        this.ws.open(
            (resp) => {
                this.showMessage(resp.payload);
            },
            () => {},
            );

        this.sendForm.on('submit', (e) => {
            e.preventDefault();

            const value = (this.sendText.el as HTMLInputElement).value;

            if (value) {
                this.ws.send(
                    {
                        type: 'message',
                        payload: {
                            message: value,
                        },
                    }
                );

                (this.sendText.el as HTMLInputElement).value = '';
            }
        });
    }

    private showMessage(data: any) {
        const author = data.author ? data.author : 'Anonist:~$ ';
        const message = data.message;
        const messageElem = Message.postMessage(author, message);
        this.messageBlock.append(messageElem);
    }

    public clear(): void {
        super.clear();

        this.ws.close();
        this.ws = null;
    }
}

export default ChatBlock;