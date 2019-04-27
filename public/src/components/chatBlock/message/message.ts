'use strict';

import Component from '../../baseComponent/index';
import Checkbox from '../../checkbox/checkbox';

class Message extends Component{

    private static template = require('./message.pug');

    private static curId: number = 0;

    private settingsButton: Checkbox;
    private optionsMenu: Component;

    private id: number;
    private author: string;
    private text: string;

    constructor(
        el: HTMLElement,
        id: number,
        author: string,
        text: string,
    ) {
        super(el);

        this.id = id;
        this.author = author;
        this.text = text;

        this.render();
    }

    public static postMessage(
        author: string,
        text: string,
    ): Message {

        const newMessage = Component.Create('div', ['chat__main__message']);

        const uniqueId = Message.getNextUniqueId();
        newMessage.el.innerHTML = Message.template({id: uniqueId, author, text});

        return new Message(newMessage.el, uniqueId, author, text);
    }

    public render(): void {
        this.optionsMenu = new Component(this.el.querySelector('.chat__main__message__options'));

        this.settingsButton = new Checkbox(this.el.querySelector(`#messageSettings${this.id}`),
            () => {
                console.log('open');
                this.optionsMenu.show();
            },
            () => {
                console.log('close');
                this.optionsMenu.hide();
            },
        );
        this.settingsButton.onChange();
    }

    private static getNextUniqueId(): number {
        Message.curId += 1;
        return Message.curId;
    }
}

export default Message;