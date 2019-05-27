'use strict';

import Component from '../../components/baseComponent/index';

abstract class Layer implements IRenderable{

    protected parent: Component;

    constructor(parent: Component) {
        this.parent = parent;
    }

    public abstract render(slug?: string[]): void;

    public abstract clear(): void;

    public renderTmpl(generatorTmpl: (param?: any) => string, param?: any): void {
        this.parent.el.innerHTML = generatorTmpl(param);
    }

    public renderTmplBesideHTML(generatorTmpl: (param?: any) => string, param?: any): void {
        this.parent.el.innerHTML += generatorTmpl(param);
    }

}

export default Layer;