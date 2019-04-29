'use strict';

import Component from '../../components/baseComponent/index';
import Layer from '../layers/layer';

abstract class Page extends Layer{

    private titleField: string;

    constructor(parent: Component, title: string) {
        super(parent);
        this.titleField = title;
    }

    get title(): string {
        return this.titleField;
    }

    set title(value: string) {
        this.titleField = value || this.titleField;
    }

    public setTitle(): void {
        document.title = this.title;
    }

    public render(): void {
        this.setTitle();
    }
}

export default Page;