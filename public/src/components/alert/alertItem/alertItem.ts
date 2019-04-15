import Component from '../../baseComponent/index';
import Button from '../../button/button';

class AlertItem extends Component {

    private static template = require('./alertItem.pug');

    private static curId: number = 0;

    private text: string;
    private id: number;

    private closeButton: Button;

    constructor(el: HTMLElement, id: number, text = '') {
        super(el);

        this.id = id;
        this.text = text;

        this.closeButton = new Button(this.el.querySelector(`#alert${this.id}`), () => {
            this.closeItem();
        });

        this.closeButton.onClick();
    }


    public static create(contentText: string, isError = false): AlertItem {

        let alertWindow: Component;

        if (isError) {

            alertWindow = Component.Create('div', ['alert__content', 'alert__content_theme_error']);

        } else {

            alertWindow = Component.Create('div', ['alert__content', 'alert__content_theme_success']);
        }

        const uniqueId = AlertItem.getNextUniqueId();
        alertWindow.el.innerHTML = AlertItem.template({text: contentText, id: uniqueId});

        return new AlertItem(alertWindow.el, uniqueId, contentText);
    }


    public setTimeoutToClose(secondsToClose: number): void {
        setTimeout(() => {

            this.closeItem();

        }, secondsToClose * 1000);
    }

    private closeItem(): void {
        this.hide();
    }

    private static getNextUniqueId(): number {
        AlertItem.curId += 1;
        return AlertItem.curId;
    }
}

export default AlertItem;