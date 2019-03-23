'use strict';

import Component from "../baseComponent/index";
import EventBus from '../../modules/event-bus';
import GameService from "../../services/game-service";
import {events} from '../../modules/utils/events';

class Paginator extends Component{

    private _pageCount: number;
    private _activePage: number;
    private _limit: number;

    private _first: Component;
    private _prev: Component;
    private _pages: Component[];
    private _next: Component;
    private _last: Component;

    constructor(el: HTMLElement, limit = 7) {
        super(el);

        this._pageCount = 0;

        this._activePage = 1;

        this._limit = limit;


        this._first = new Component(this.el.querySelector('.pagination__first'));

        this._prev = new Component(this.el.querySelector('.pagination__prev'));

        this._pages = Array.from(this.el.querySelectorAll('.pagination__page'))
            .map(page => new Component(<HTMLElement>page));

        this._next = new Component(this.el.querySelector('.pagination__next'));

        this._last = new Component(this.el.querySelector('.pagination__last'));


        this.onClick();

        EventBus.subscribe(events.chengePage, () => {
            const offset = (this._activePage - 1) * this._limit;

            GameService.getScores(1, this._limit, (this._activePage - 1) * this._limit)
                .then(resp => {

                    EventBus.publish(events.fillTable, {users: resp, offset: offset});
                    return GameService.getCountUsers(1);
                })
                .then(resp => {

                    this._pageCount = Math.floor((resp.count - 1) / this._limit + 1);
                })
                .catch(() => {
                    // console.log(err.message);
                });

            this.renderPaginator()
        });

        this.renderPaginator();

    }

    get pageCount() {
        return this._pageCount;
    }

    set pageCount(value) {
        this._pageCount = value;
        EventBus.publish(events.chengePage, '');
    }

    get activePage() {
        return this._activePage;
    }

    set activePage(value) {
        this._activePage = value;
        EventBus.publish(events.chengePage, '');
    }

    public onClick(): void {
        this._first.on('click', () => {
            this._activePage = 1;
            EventBus.publish(events.chengePage, '');
        });

        this._prev.on('click', () => {
            this._activePage -= 1;
            EventBus.publish(events.chengePage, '');
        });

        this._next.on('click', () => {
            this._activePage += 1;
            EventBus.publish(events.chengePage, '');
        });

        this._last.on('click', () => {
            this._activePage = this._pageCount;
            EventBus.publish(events.chengePage, '');
        });

        this._pages.map(page => {
            page.on('click', (e) => {
                this._activePage = +(<HTMLElement>e.target).innerText;
                EventBus.publish(events.chengePage, '');
            })
        })
    }

    private getAccessPages(): number[] {
        const border = (this._pages.length - 1) / 2;
        const pages = [];

        for (let i = this._activePage - border; i <= this._activePage + border; i++) {
            pages.push(i);
        }

        return pages.filter(page => {
            return page >= 1 && page <= this._pageCount;
        })
    }

    private renderPaginator(): void {
        if (this._activePage > 1) {

            this._first.show();
            this._prev.show();

        } else {

            this._first.hide();
            this._prev.hide();
        }


        if (this._activePage < this._pageCount) {

            this._next.show();
            this._last.show();

        } else {

            this._next.hide();
            this._last.hide();
        }

        let pages = this.getAccessPages();

        let i = 0;
        for (; i < pages.length; i++) {

            if (pages[i] !== this._activePage) {
                this._pages[i].disactive();
            } else {
                this._pages[i].active();
            }

            this._pages[i].show();
            this._pages[i].setText(pages[i].toString());
        }

        for (; i < this._pages.length; i++) {
            this._pages[i].hide();
        }
    }
}

export default Paginator;