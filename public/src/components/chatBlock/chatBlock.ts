'use strict';

import Component from '../baseComponent/index';
import ChatService from '../../services/chat-service';
import Message from './message/message';

class ChatBlock extends Component {

    private messageBlock: Component;
    private sendText: Component;
    private sendForm: Component;

    private static template = require('./chatBlock.pug');

    constructor() {
        const alertContainer = Component.Create('div', ['chat', 'chat_direction_top-right']);
        document.body.insertBefore(alertContainer.el, document.body.firstChild);

        super(document.querySelector('.chat'));
    }

    public render(): void {
        this.el.innerHTML = ChatBlock.template();

        this.messageBlock = new Component(this.el.querySelector('.chat__main'));

        this.sendText = new Component(this.el.querySelector('.chat__input'));

        this.sendForm = new Component(this.el.querySelector('.form_theme_chat'));

        const ws = ChatService.sendMessage();
        ws.open(
            (resp) => {
                this.showMessage(resp);
            },
            () => {},
            );

        this.sendForm.on('submit', (e) => {
            e.preventDefault();

            ws.send(
                {
                    type: 'message',
                    payload: {
                        message: (this.sendText.el as HTMLInputElement).value,
                    },
                }
            );
        });
    }

    private showMessage(message: string) {
        const messageElem = Message.postMessage('Anonist:~$ ', message);
        this.messageBlock.append(messageElem);
    }
}

export default ChatBlock;