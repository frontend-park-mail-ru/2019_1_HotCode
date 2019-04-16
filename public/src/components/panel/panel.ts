'use strict';

import Component from '../baseComponent/index';
import {onDragAndDrop} from '../../modules/dragAndDrop';

class Panel extends Component{


    private line: Component;
    private content: Component;

    constructor(el: HTMLElement) {
        super(el);

        this.line = new Component(this.el.querySelector('.play__item__horizontal-line__outline'));
        this.content = new Component(this.el.querySelector('.play__item__content'));

        if (this.line.el) {
            onDragAndDrop(this.line, this.onMove);
        }
    }

    private onMove = (shiftX: number, shiftY: number) => {
        return (e: MouseEvent): void => {
            e.preventDefault();

            this.content.el.style.height =
                e.pageY -
                (this.content.el.offsetTop +
                    shiftY -
                    this.line.el.offsetHeight / 4) +
                'px';
        };
    };
}

export default Panel;