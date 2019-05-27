'use strict';

import Component from '../baseComponent/index';
import {onDragAndDrop} from '../../modules/dragAndDrop';

class Panel extends Component{


    private line: Component;
    private content: Component;
    private leftContainer: Component;

    constructor(el: HTMLElement) {
        super(el);

        this.line = new Component(this.el.querySelector('.play__item__horizontal-line__outline'));
        this.content = new Component(this.el.querySelector('.play__item__content'));
        this.leftContainer = new Component(document.querySelector('.game-content'));

        if (this.line.el) {
            onDragAndDrop(this.line, this.onMove);
        }
    }

    private onMove = (shiftX: number, shiftY: number) => {
        return (e: MouseEvent): void => {
            e.preventDefault();

            this.content.el.style.height =
                e.pageY -
                (this.el.offsetTop +
                 this.content.el.offsetTop +
                    this.leftContainer.el.offsetTop +
                    shiftY ) +
                this.line.el.offsetHeight / 2 +
                'px';
        };
    };
}

export default Panel;