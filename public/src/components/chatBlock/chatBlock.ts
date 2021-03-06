'use strict';

import Component from '../baseComponent/index';
import ChatService from '../../services/chat-service';
import Message from './message/message';
import ScrollableBlock from '../scrollable/scrollable';
import WebSock from '../../modules/webSocket';
import EventBus from '../../modules/event-bus';
import {events} from '../../modules/utils/events';

class ChatBlock extends Component {

    private messageBlock: Component;
    private sendText: Component;
    private sendForm: Component;

    private ws: WebSock;

    private onAuthorizedRemover: {[key: string]: () => void};
    private onUnauthorizedRemover: {[key: string]: () => void};

    private static template = require('./chatBlock.pug');

    constructor() {
        const alertContainer = Component.Create('div', ['chat', 'chat_direction_top-right']);
        document.body.insertBefore(alertContainer.el, document.body.firstChild);

        super(document.querySelector('.chat'));
    }

    public render(): void {
        this.el.innerHTML = ChatBlock.template();

        this.onAuthorizedRemover = EventBus.subscribe(events.authorized, () => {
            if (this.ws) {
                this.ws.close();
            }
            this.ws = null;

            this.ws = ChatService.sendMessage();
        });

        this.onUnauthorizedRemover = EventBus.subscribe(events.unauthorized, () => {
            if (this.ws) {
                this.ws.close();
            }
            this.ws = null;

            this.ws = ChatService.sendMessage();
        });

        const messageBlockContent = new ScrollableBlock(this.el.querySelector('.chat__main'));
        messageBlockContent.decorate();

        this.messageBlock = new Component(this.el.querySelector('.scrollable__content'));

        this.sendText = new Component(this.el.querySelector('.chat__field__input'));

        this.sendForm = new Component(this.el.querySelector('.form_theme_chat'));

        this.ws = ChatService.sendMessage();
        this.ws.open(
            () => {
                this.ws.send(
                    {
                        type: 'messages',
                        chat_id: 1,
                        payload: {
                            limit: 1000,
                            offset: 0,
                        },
                    }
                );
            },
            (resp) => {
                if (resp.type === 'message') {
                    this.showMessage(resp);
                    return;
                }

                if (resp.type === 'messages') {
                    this.loadMessages(resp);
                    return;
                }
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
                        chat_id: 1,
                        payload: {
                            message: value,
                        },
                    }
                );

                (this.sendText.el as HTMLInputElement).value = '';
            }
        });

        EventBus.subscribe(events.onEditMessage, (message) => {
            this.sendText.el.focus();
            // const remover = this.sendForm.on('submit', (e) => {
            //     e.preventDefault();
            //     e.stopPropagation();
            //
            //     const value = (this.sendText.el as HTMLInputElement).value;
            //
            //     if (value) {
            //
            //         message.text = value;
            //
            //         (this.sendText.el as HTMLInputElement).value = '';
            //     }
            //
            // });
        });
    }

    private showMessage(data: any) {
        const author = data.author ? data.author.username : 'X@k3P:~$ ';
        const message = data.payload.message;
        const messageElem = Message.postMessage(author, message);
        this.messageBlock.append(messageElem);
        messageElem.el.scrollIntoView(false);
    }

    private loadMessages(data: any) {
        data.payload.messages
            .reverse()
            .map((item: any) => {

                const author = item.author ? item.author : 'X@k3P:~$ ';
                const message = item.message;
                const messageElem = Message.postMessage(author, message);
                this.messageBlock.append(messageElem);
            });
        this.messageBlock.el.lastElementChild.scrollIntoView(false);
    }

    public clear(): void {
        super.clear();
        this.onAuthorizedRemover.unsubscribe();
        this.onUnauthorizedRemover.unsubscribe();

        if (this.ws) {
            this.ws.close();
        }
        this.ws = null;
    }
}

export default ChatBlock;