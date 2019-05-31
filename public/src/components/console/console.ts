'use strict';

import Component from '../baseComponent/index';

class Console extends Component{

    constructor() {
        super(Component.Create().el);

        this.render();
    }

    public updateParent(newParent: Component): void {
        this.el = newParent.el;
    }

    public createLog(textLog: string): void {

        const newLog = Component.Create(
            'div',
            ['play__item__content__console-item'],
        );

        this.append(newLog);

    }
}

export default new Console();