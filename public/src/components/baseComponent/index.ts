'use strict';

class Component {

    protected elField: HTMLElement;

    constructor(el: HTMLElement) {
        this.elField = el;
    }

    get el(): HTMLElement {
        return this.elField;
    }

    set el(value: HTMLElement) {
        this.elField = value;
    }

    public static Create(tagName: string = 'div',
                         classes: string[] = [],
                         attrs: {[key: string]: string} = {}): Component
    {
        const el: HTMLElement = document.createElement(tagName);

        classes.map((cls) => {
            el.classList.add(cls);
        });

        for (const name of Object.keys(attrs)) {
            el.setAttribute(name, attrs[name]);
        }

        return new Component(el);
    }

    public static getBy(querySelector: string): Component {
        return new Component(document.querySelector(querySelector));
    }

    public addClass(className: string): void {
        this.elField.classList.add(className);
    }

    public removeClass(className: string): void {
        this.elField.classList.remove(className);
    }

    public hide(): void {
        this.elField.classList.add('hidden');
    }

    public show(): void {
        this.elField.classList.remove('hidden');
    }

    public active(): void {
        this.elField.classList.add('active');
    }

    public disactive(): void {
        this.elField.classList.remove('active');
    }

    public setText(text: string): void {
        this.elField.textContent = text;
    }

    public append(component: Component): Component {
        this.elField.appendChild(component.elField);
        return this;
    }

    public on(event: string, callback: EventListener): {[key: string]: () => void} {

        this.elField.addEventListener(event, callback);

        return {
            remover: () => {
                this.elField.removeEventListener(event, callback);
            },
        };
    }

    public clear(): void {
        this.el.innerHTML = '';
    }
}

export default Component;