'use strict';

import Component from '../../components/baseComponent/index';
import Layer from '../layers/layer';

abstract class Page extends Layer{

    private _title: string;

    constructor(parent: Component, title: string) {
        super(parent);
        this._title = title;
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value || this._title;
    }

    public render(): void {
        document.title = this.title;
    }
}

export default Page;