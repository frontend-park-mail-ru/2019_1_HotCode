import Component from '../baseComponent/index';
import AlertItem from './alertItem/alertItem';

class Alert extends Component {
    constructor() {
        const alertContainer = Component.Create('div', ['alert', 'alert_direction_top-right']);
        document.body.insertBefore(alertContainer.el, document.body.firstChild);

        super(document.querySelector('.alert'));
    }

    public updateElement(): void {
        this.el = document.querySelector('.alert');
    }

    public alert(contentText: string, isError?: boolean): void {
        const alertWindow = AlertItem.create(contentText, isError);
        this.append(alertWindow);
        alertWindow.setTimeoutToClose(3);
    }
}

export default new Alert();