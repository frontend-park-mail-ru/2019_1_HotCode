'use strict';

import Component from "../baseComponent";
import EventBus from '../../modules/event-bus';

class Paginator extends Component{
    constructor(el) {
        super(el);

        this._pageCount = 8;
        this._activePage = 2;

        this.first = new Component(this.el.querySelector('.pagination__first'));
        this.prev = new Component(this.el.querySelector('.pagination__prev'));
        this.pages = Array.from(this.el.querySelectorAll('.pagination__page'))
            .map(page => new Component(page));
        this.next = new Component(this.el.querySelector('.pagination__next'));
        this.last = new Component(this.el.querySelector('.pagination__last'));

        this.onClick();
        EventBus.subscribe('chengePage', () => {
            this.renderPaginator()
        });
        this.renderPaginator();

    }

    get pageCount() {
        return this._pageCount;
    }

    set pageCount(value) {
        this._pageCount = value;
    }

    get activePage() {
        return this._activePage;
    }

    set activePage(value) {
        this._activePage = value;
    }

    onClick() {
        this.first.on('click', () => {
            this._activePage = 1;
            EventBus.publish('chengePage', '');
        });

        this.prev.on('click', () => {
            this._activePage -= 1;
            EventBus.publish('chengePage', '');
        });
        this.next.on('click', () => {
            this._activePage += 1;
            EventBus.publish('chengePage', '');
        });
        this.last.on('click', () => {
            this._activePage = this._pageCount;
            EventBus.publish('chengePage', '');
        });
        this.pages.map(page => {
            page.on('click', (e) => {
                this._activePage = +e.target.innerText;
                EventBus.publish('chengePage', '');
            })
        })
    }

    getAccessPages() {
        const border = (this.pages.length - 1) / 2;
        const pages = [];
        for (let i = this._activePage - border; i <= this._activePage + border; i++) {
            pages.push(i);
        }
        return pages.filter(page => {
            return page >= 1 && page <= this._pageCount;
        })
    }

    renderPaginator() {
        if (this._activePage > 1) {
            this.first.show();
            this.prev.show();
        } else {
            this.first.hide();
            this.prev.hide();
        }
        if (this._activePage < this._pageCount) {
            this.next.show();
            this.last.show();
        } else {
            this.next.hide();
            this.last.hide();
        }

        let pages = this.getAccessPages();

        let i = 0;
        for (; i < pages.length; i++) {
            if (pages[i] !== this._activePage) {
                this.pages[i].disactive();
            } else {
                this.pages[i].active();
            }
            this.pages[i].show();
            this.pages[i].setText(pages[i]);
        }
        for (; i < this.pages.length; i++) {
            this.pages[i].hide();
        }
    }
}

export default Paginator;