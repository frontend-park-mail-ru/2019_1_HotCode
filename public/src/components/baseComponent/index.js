'use strict';

class Component {
    constructor(el) {
        this.el = el;
    }

    static Create(tagName = 'div', classes = [], attrs = {}) {
        const el = document.createElement(tagName);
        classes.forEach(className => {
           el.classList.add(className);
        });
        for (let name in attrs) {
            el.setAttribute(name, attrs[name]);
        }
        return new Component(el);
    }

    hide() {
        this.el.classList.add('hidden');
    }

    show() {
        this.el.classList.remove('hidden');
    }

    active() {
        this.el.classList.add('active');
    }

    disactive() {
        this.el.classList.remove('active');
    }

    setText(text) {
        this.el.textContent = text;
    }

    append(component) {
        this.el.appendChild(component.el);
        return this;
    }

    off(event, callback) {
        this.el.removeEventListener(event, callback);
    }

    on(event, callback) {
        this.el.addEventListener(event, callback);
    }
}

export default Component;