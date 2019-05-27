import Component from '../baseComponent/index';
import AlertItem from './alertItem/alertItem';

class Alert extends Component {
    constructor() {
        const alertContainer = Component.Create('div', ['alert', 'alert_direction_top-right']);
        document.body.insertBefore(alertContainer.el, document.body.firstChild);

        super(document.querySelector('.alert'));
    }

    public alert(contentText: string, isError?: boolean): void {

        const alertWindow = AlertItem.create(contentText, isError);
        this.append(alertWindow);
        alertWindow.setTimeoutToClose(5);
    }

    public notify(
        contentText: string,
        linkText: string,
        callbackOnClick: () => void
    ): void {

        const alertWindow = AlertItem.createNotify(contentText, linkText, callbackOnClick);
        this.append(alertWindow);
        alertWindow.setTimeoutToClose(8);
    }
}

export default new Alert();