import Component from '../baseComponent/index';
import Tab from './tab';

class Tabbar extends Component {

    private tabsField: Tab[];
    private onStop: {[key: string]: () => void};

    constructor(el: HTMLElement, callbacks: {[key: string]: () => void}) {
        super(el);

        this.tabsField = Array.from(this.el.querySelectorAll('input[type="radio"]'))
            .map((tab) => new Tab(tab as HTMLElement));

        for (const tabId of Object.keys(callbacks)) {
            this.getTabById(tabId).callback = callbacks[tabId];
        }
    }


    get tabs(): Tab[] {
        return this.tabsField;
    }

    public onChange(): void {
        this.onStop = this.on('change', (event) => {
            if ((event.target as HTMLInputElement).checked) {

                const currentStateOfTabbar = new Component(this.el.querySelector('input:checked'));

                this.getTabById(currentStateOfTabbar.el.id).emit();
            }
        });
    }

    private getTabById(id: string): Tab {
        return this.tabsField.filter((tab) => tab.getId() === id)[0];
    }

    public stop(): void {
        this.onStop.remover();
        this.tabsField.forEach((tab) => {

            tab.stop();
        })
    }
}

export default Tabbar;