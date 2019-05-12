'use strict';

import Component from '../../baseComponent/index';

class Row extends Component{

    private cellsField: Component[];
    private idField: number;

    constructor(el: HTMLElement) {
        super(el);

        this.cellsField = Array.from(this.el.children)
            .map((cell) => {
                return new Component(cell as HTMLElement);
            });

        this.idField = parseInt(this.el.getAttribute('data-id'));
    }


    get cells(): Component[] {
        return this.cellsField;
    }

    get id(): number {
        return this.idField;
    }
}

export default Row;