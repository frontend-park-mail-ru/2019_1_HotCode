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
        this.elField.classList.remove('link');
        this.elField.classList.remove('pointer');
    }

    public disactive(): void {
        this.elField.classList.remove('active');
        this.elField.classList.add('link');
        this.elField.classList.add('pointer');
    }

    public getText(): string {
        return this.elField.textContent;
    }

    public setText(text: string): void {
        this.elField.textContent = text;
    }

    public setTextAnim(content: string, speed = 1): void {
        const text = document.createElement('span');

        const value = content;
        let html = '';

        for(let w of value){
            if(w === ' ') w = '&nbsp;';
            html += `<span class="letter">${w}</span>`;
        }
        text.innerHTML = html;

        this.elField.innerHTML = '';
        this.elField.append(text);
        this.animText(text, speed);
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

    public top(): any {
        let element = this.el;
        let resultTop = 0;

        while (element) {
            resultTop += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent as HTMLElement;
        }

        return resultTop;
    }

    public left(): number {
        let element = this.el;
        let resultLeft = 0;

        while (element) {
            resultLeft += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            element = element.offsetParent as HTMLElement;
        }

        return resultLeft;
    }

    public render(param?: any): any {

    }

    public clear(): void {
        this.el.innerHTML = '';
    }

    private animText(textElement: HTMLElement,speed: number): void {
        const letters = Array.from(textElement.children);
        const time = 50 / speed;
        letters.forEach((letter, i) => {
            setTimeout(() => {
                if (speed < 1) {

                    letter.classList.add('letter_theme_slow');

                } else {

                    letter.classList.add('letter_theme_normal');
                }
            }, (time * i))
        })
    }
}

export default Component;