'use strict';

import Component from '../baseComponent/index';

class Panel extends Component{


    private line: Component;
    private content: Component;

    constructor(el: HTMLElement) {
        super(el);

        this.line = new Component(this.el.querySelector('.play__item__horizontal-line__outline'));
        this.content = new Component(this.el.querySelector('.play__item__content'));

        if (this.line.el) {
            this.onDragNDrop();
        }
    }

    private onDragNDrop(): void {
        this.line.el.onmousedown = (event) => {
            document.addEventListener('mousemove', this.onMove);

            document.onmouseup = (e) => {
                document.removeEventListener('mousemove', this.onMove);
                document.onmouseup = null;
            };
        };
        this.line.el.ondragstart = () => {
            return false;
        };
    }

    private onMove = (e: MouseEvent): void => {
        this.content.el.style.height = e.pageY - this.content.el.offsetTop + 'px';
    };
}

export default Panel;