import Component from '../baseComponent';
import Tab from './tab';

class Tabbar extends Component {
    constructor(el, callbacks) {
        super(el);

        this._tabbarContent = new Component(this.el.querySelector('div'));
        this._tabs = Array.from(this.el.querySelectorAll('input[type="radio"]')).map(tab => new Tab(tab));
        for (let tabId in callbacks) {
            this.getTabById(tabId).callback = callbacks[tabId];
        }
    }

    getTabById(id) {
        return this._tabs.filter(tab => tab.getId() === id)[0];
    }

    onChange() {
        this.on('change', (event) => {
            if (event.target.checked) {
                const currentStateOfTabbar = new Component(this.el.querySelector('input:checked'));

                this.getTabById(currentStateOfTabbar.el.id).emit();
            }
        });
    }


}

export default Tabbar;