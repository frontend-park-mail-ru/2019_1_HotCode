'use strict';

class Component {

    protected _el: HTMLElement;

    constructor(el: HTMLElement) {
        this._el = el;
    }

    get el(): HTMLElement {
        return this._el;
    }

    set el(value: HTMLElement) {
        this._el = value;
    }

    public static Create(tagName: string = 'div',
                  classes: string[] = [],
                  attrs: {[key: string]: string} = {}): Component
    {
        const el: HTMLElement = document.createElement(tagName);

        classes.map(cls => {
            el.classList.add(cls);
        });

        for (let name in attrs) {
            el.setAttribute(name, attrs[name]);
        }

        return new Component(el);
    }

    public static getBy(querySelector: string): Component {
        return new Component(document.querySelector(querySelector));
    }

    public addClass(className: string): void {
        this._el.classList.add(className);
    }

    public removeClass(className: string): void {
        this._el.classList.remove(className);
    }

    public hide(): void {
        this._el.classList.add('hidden');
    }

    public show(): void {
        this._el.classList.remove('hidden');
    }

    public active(): void {
        this._el.classList.add('active');
    }

    public disactive(): void {
        this._el.classList.remove('active');
    }

    public setText(text: string): void {
        this._el.textContent = text;
    }

    public append(component: Component): Component {
        this._el.appendChild(component._el);
        return this;
    }

    public on(event: string, callback: EventListener): {[key: string]: () => void} {

        this._el.addEventListener(event, callback);

        return {
            remover: () => {
                this._el.removeEventListener(event, callback);
            }
        }
    }
}

export default Component;