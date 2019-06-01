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

    public createLog(textLog: string, isError = false): void {

        const newLog = Component.Create(
            'div',
            ['play__item__content__console-item'],
        );

        if (isError) {
            newLog.addClass('play__item__content__console-item_theme_error');
        }

        newLog.setTextAnim(textLog);

        this.append(newLog);

    }
}

export default new Console();