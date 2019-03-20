import Component from '../baseComponent/index';
import Tab from './tab';

class Tabbar extends Component {

    private _tabbarContent: Component;
    private _tabs: Tab[];

    constructor(el: HTMLElement, callbacks: {[key: string]: () => void}) {
        super(el);

        this._tabbarContent = new Component(this.el.querySelector('div'));

        this._tabs = Array.from(this.el.querySelectorAll('input[type="radio"]')).map(tab => new Tab(<HTMLElement>tab));

        for (let tabId in callbacks) {
            this.getTabById(tabId).callback = callbacks[tabId];
        }
    }

    public onChange(): void {
        this.on('change', (event) => {
            if ((<HTMLInputElement>event.target).checked) {

                const currentStateOfTabbar = new Component(this.el.querySelector('input:checked'));

                this.getTabById(currentStateOfTabbar.el.id).emit();
            }
        });
    }

    private getTabById(id: string): Tab {
        return this._tabs.filter(tab => tab.getId() === id)[0];
    }

}

export default Tabbar;