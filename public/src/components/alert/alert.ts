import Component from '../baseComponent/index';
import AlertItem from './alertItem/alertItem';

class Alert extends Component {
    constructor() {
        const alertContainer = Component.Create('div', ['alert__container']);
        document.body.insertBefore(alertContainer.el, document.body.firstChild);

        super(document.querySelector('.alert__container'));
    }

    public updateElement(): void {
        this.el = document.querySelector('.alert__container');
    }

    public alert(contentText: string, isError?: boolean): void {
        const alertWindow = AlertItem.create(contentText, isError);
        this.append(alertWindow);
        alertWindow.setTimeoutToClose(3);
    }
}

export default new Alert();