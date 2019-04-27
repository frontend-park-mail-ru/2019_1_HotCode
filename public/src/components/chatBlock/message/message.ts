'use strict';

import Component from '../../baseComponent/index';

class Message extends Component{

    private static template = require('./message.pug');

    private author: string;
    private text: string;

    constructor(
        el: HTMLElement,
        author: string,
        text: string,
    ) {
        super(el);

        this.author = author;
        this.text = text;
    }

    public static postMessage(
        author: string,
        text: string,
    ): Message {

        const newMessage = Component.Create('div', ['chat__main__message']);

        newMessage.el.innerHTML = Message.template({author, text});

        return new Message(newMessage.el, author, text);
    }

}

export default Message;