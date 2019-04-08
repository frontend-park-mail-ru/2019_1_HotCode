'use strict';

import Component from "../baseComponent/index";
import EventBus from '../../modules/event-bus';
import GameService from "../../services/game-service";
import {events} from '../../modules/utils/events';

class Paginator extends Component{

    private pageCountField: number;
    private activePageField: number;
    private limit: number;

    private first: Component;
    private prev: Component;
    private pages: Component[];
    private next: Component;
    private last: Component;

    private chengePageCallback: (limit: number, offset: number) => void;

    constructor(el: HTMLElement, limit = 7, chengePageCallback: (limit: number, offset: number) => void) {
        super(el);

        this.pageCountField = 0;

        this.activePageField = 1;

        this.limit = limit;


        this.first = new Component(this.el.querySelector('.pagination__first'));

        this.prev = new Component(this.el.querySelector('.pagination__prev'));

        this.pages = Array.from(this.el.querySelectorAll('.pagination__page'))
            .map((page) => new Component(page as HTMLElement));

        this.next = new Component(this.el.querySelector('.pagination__next'));

        this.last = new Component(this.el.querySelector('.pagination__last'));


        this.chengePageCallback = chengePageCallback;

        this.onClick();

        EventBus.subscribe(events.chengePage, () => {
            const offset = (this.activePageField - 1) * this.limit;

            this.chengePageCallback(this.limit, offset);
            // GameService.getScores('pong', this.limit, (this.activePageField - 1) * this.limit)
            //     .then((resp) => {
            //
            //         EventBus.publish(events.fillTable, {users: resp, offset});
            //         return GameService.getCountUsers('pong');
            //     })
            //     .then((resp) => {
            //
            //         this.pageCountField = Math.floor((resp.count - 1) / this.limit + 1);
            //     })
            //     .catch(() => {
            //         // console.log(err.message);
            //     });

            // this.renderPaginator();
        });
    }

    get pageCount() {
        return this.pageCountField;
    }

    set pageCount(value) {
        this.pageCountField = value;
        // EventBus.publish(events.chengePage, '');
    }

    get activePage() {
        return this.activePageField;
    }

    set activePage(value) {
        this.activePageField = value;
        // EventBus.publish(events.chengePage, '');
    }

    private onClick(): void {
        this.first.on('click', () => {
            this.activePageField = 1;
            EventBus.publish(events.chengePage, '');
        });

        this.prev.on('click', () => {
            this.activePageField -= 1;
            EventBus.publish(events.chengePage, '');
        });

        this.next.on('click', () => {
            this.activePageField += 1;
            EventBus.publish(events.chengePage, '');
        });

        this.last.on('click', () => {
            this.activePageField = this.pageCountField;
            EventBus.publish(events.chengePage, '');
        });

        this.pages.map((page) => {
            page.on('click', (e) => {
                this.activePageField = +(e.target as HTMLElement).innerText;
                EventBus.publish(events.chengePage, '');
            });
        });
    }

    private getAccessPages(): number[] {
        const border = (this.pages.length - 1) / 2;
        const pages = [];

        for (let i = this.activePageField - border; i <= this.activePageField + border; i++) {
            pages.push(i);
        }

        return pages.filter((page) => {
            return page >= 1 && page <= this.pageCountField;
        });
    }

    public renderPaginator(): void {
        // if (this.activePageField <= 1 && this.activePageField > this.pageCountField) {
        //     this.hide();
        //     return;
        // } else {
        //     this.show();
        // }

        if (this.activePageField > 1) {

            this.first.show();
            this.prev.show();

        } else {

            this.first.hide();
            this.prev.hide();
        }


        if (this.activePageField < this.pageCountField) {

            this.next.show();
            this.last.show();

        } else {

            this.next.hide();
            this.last.hide();
        }

        const pages = this.getAccessPages();

        let i = 0;
        for (; i < pages.length; i++) {

            if (pages[i] !== this.activePageField) {
                this.pages[i].disactive();
            } else {
                this.pages[i].active();
            }

            this.pages[i].show();
            this.pages[i].setText(pages[i].toString());
        }

        for (; i < this.pages.length; i++) {
            this.pages[i].hide();
        }
    }
}

export default Paginator;