'use strict';

import Component from '../baseComponent/index';
import ChatService from '../../services/chat-service';

class ChatBlock extends Component {

    private answerText: Component;
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

        this.answerText = new Component(this.el.querySelector('.chat__answer'));

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
        const messageElem = document.createElement('div');
        messageElem.innerText = message;
        this.answerText.append(new Component(messageElem));
    }
}

export default ChatBlock;