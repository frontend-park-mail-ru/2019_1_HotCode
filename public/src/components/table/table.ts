'use strict';


import Component from '../baseComponent/index';
import Carousel from '../carousel/carousel';

class Table extends Component{

    private static template = require('./table.pug');

    constructor(el: HTMLElement) {
        super(el);
    }

    public render(data: {[key: string]: any}): void {
        this.el.innerHTML = Table.template(data);
    }
}

export default Table;