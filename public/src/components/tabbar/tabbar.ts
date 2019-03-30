import Component from '../baseComponent/index';
import Tab from './tab';

class Tabbar extends Component {

    private tabbarContent: Component;
    private tabs: Tab[];

    constructor(el: HTMLElement, callbacks: {[key: string]: () => void}) {
        super(el);

        this.tabbarContent = new Component(this.el.querySelector('div'));

        this.tabs = Array.from(this.el.querySelectorAll('input[type="radio"]'))
            .map((tab) => new Tab(tab as HTMLElement));

        for (const tabId of Object.keys(callbacks)) {
            this.getTabById(tabId).callback = callbacks[tabId];
        }
    }

    public onChange(): void {
        this.on('change', (event) => {
            if ((event.target as HTMLInputElement).checked) {

                const currentStateOfTabbar = new Component(this.el.querySelector('input:checked'));

                this.getTabById(currentStateOfTabbar.el.id).emit();
            }
        });
    }

    private getTabById(id: string): Tab {
        return this.tabs.filter((tab) => tab.getId() === id)[0];
    }

}

export default Tabbar;