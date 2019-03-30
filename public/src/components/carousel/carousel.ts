'use strict';

import Component from "../baseComponent/index";
import EventBus from '../../modules/event-bus';
import {events} from '../../modules/utils/events';
import Parallax from '../../modules/parallax';

/**
 * Carousel Component for carousel
 * @extends {Component}
 */
class Carousel extends Component{

    private static template = require('./carousel.pug');

    private clickCallback: (param?: any) => any;

    private leftArrow: Component;
    private items: Component[];
    private prevItem: Component;
    private centerItem: Component;
    private nextItem: Component;
    private rightArrow: Component;

    private centerItemId: number;
    private countItems: number;

    private limit: number;

    private parallax: Parallax;

    private mainClickRemover: {[key: string]: () => void};
    private onLeftSideClickRemover: {[key: string]: () => void};
    private onRightSideClickRemover: {[key: string]: () => void};

    constructor(el: HTMLElement,
                callback: () => void,
                items: Array<{[key: string]: string | number}> = []) {

        super(el);

        callback = callback ? callback : () => {
            return;
        };

        this.centerItemId = 0;

        this.countItems = items.length;

        this.limit = 3;

        this.clickCallback = callback;

        this.render(items);
    }

    public render(items: Array<{[key: string]: string | number}>): void {
        this.el.innerHTML = Carousel.template({games: items});

        this.leftArrow = new Component(this.el.querySelector('.left__arrow'));

        this.items = Array.from(this.el.querySelectorAll('.carusel__item'))
            .map((item) => new Component(item as HTMLElement));

        this.rightArrow = new Component(this.el.querySelector('.right__arrow'));

        this.onArrowsClick();

        EventBus.subscribe(events.chengeStateCarousel, () => {

            this.updateCarousel();
            this.onItems();
        });

        this.updateCarousel();
        this.onItems();
    }

    public updateCarousel(): void {


        if (this.centerItemId > 0) {

            this.leftArrow.show();

        } else {

            this.leftArrow.hide();
        }

        if (this.centerItemId < this.countItems - 1) {

            this.rightArrow.show();

        } else {

            this.rightArrow.hide();
        }

        if (this.parallax) {

            this.parallax.offMouseMove();
        }
        this.parallax = null;
        this.centerItem = null;
        this.prevItem = null;
        this.nextItem = null;

        const accessItems = this.getAccessItems();

        for (let i = 0; i < this.items.length; i++) {

            if (accessItems.indexOf(i) !== -1) {

                if (i < this.centerItemId) {

                    this.items[i].removeClass('center__item');
                    this.items[i].removeClass('next__item');
                    this.items[i].addClass('prev__item');

                    this.prevItem = new Component(this.el.querySelector('.prev__item'));

                } else if (i > this.centerItemId) {

                    this.items[i].removeClass('prev__item');
                    this.items[i].removeClass('center__item');
                    this.items[i].addClass('next__item');

                    this.nextItem = new Component(this.el.querySelector('.next__item'));

                } else {

                    this.items[i].removeClass('prev__item');
                    this.items[i].removeClass('next__item');
                    this.items[i].addClass('center__item');

                    this.centerItem = new Component(this.el.querySelector('.center__item'));

                    this.parallax = new Parallax(this.centerItem, -4, 4);
                    this.parallax.onMouseMove();
                    this.parallax.degMainBackground();
                }

                this.items[i].show();

            } else {

                this.items[i].el.style.animationName = '';
                this.items[i].removeClass('prev__item');
                this.items[i].removeClass('next__item');
                this.items[i].removeClass('center__item');
                this.items[i].hide();
            }
        }

    }

    public onArrowsClick(): void {
        this.leftArrow.on('click', this.inLeftCallback);

        this.rightArrow.on('click', this.inRightCallback);
    }

    public onItems() {

        if (this.onLeftSideClickRemover) {

            this.onLeftSideClickRemover.remover();
        }

        if (this.mainClickRemover) {

            this.mainClickRemover.remover();
        }

        if (this.onRightSideClickRemover) {

            this.onRightSideClickRemover.remover();
        }

        if (this.prevItem) {

            this.onLeftSideClickRemover =
                this.prevItem.on('click', this.inLeftCallback);
        }

        if (this.centerItem) {

            this.mainClickRemover =
                this.centerItem.on('click', this.clickCallback);
        }

        if (this.nextItem) {

            this.onRightSideClickRemover =
                this.nextItem.on('click', this.inRightCallback);
        }
    }

    private inLeftCallback = () => {

        this.centerItem.el.style.animationName = 'inright';
        this.prevItem.el.style.animationName = 'outleft';

        this.centerItemId -= 1;
        EventBus.publish(events.chengeStateCarousel);
    };

    private inRightCallback = () => {

        this.nextItem.el.style.animationName = 'outright';
        this.centerItem.el.style.animationName = 'inleft';

        this.centerItemId += 1;
        EventBus.publish(events.chengeStateCarousel);
    };

    private getAccessItems(): number[] {
        const border = (this.limit - 1) / 2;
        const items = [];

        for (let i = this.centerItemId - border; i <= this.centerItemId + border; i++) {
            items.push(i);
        }

        return items.filter((item) => {
            return item >= 0 && item <= this.countItems - 1;
        });
    }
}

export default Carousel;