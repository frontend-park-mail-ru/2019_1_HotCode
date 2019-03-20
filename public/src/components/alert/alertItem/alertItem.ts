import Component from '../../baseComponent/index';
import Button from '../../button/button';

class AlertItem extends Component {

    private static template = require('./alertItem.pug');

    private _text: string;
    private _id: number;

    private _closeButton: Button;

    constructor(el: HTMLElement, id: number, text = '') {
        super(el);

        this._id = id;
        this._text = text;

        this._closeButton = new Button(this.el.querySelector(`#alert${this._id}`), () => {
            this.closeItem();
        });

        this._closeButton.onClick();
    }


    public static create(contentText: string, isError = false): AlertItem {

        let alertWindow: Component;

        if (isError) {

            alertWindow = Component.Create('div', ['alert__error']);

        } else {

            alertWindow = Component.Create('div', ['alert']);
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


    private static curId: number = 0;

    private static getNextUniqueId(): number {
        AlertItem.curId += 1;
        return AlertItem.curId;
    }
}

export default AlertItem;