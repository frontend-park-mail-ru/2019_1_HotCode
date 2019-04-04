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

    public getCenterItem(): Component {
        return this.centerItem;
    }

    private render(items: Array<{[key: string]: string | number}>): void {
        this.el.innerHTML = Carousel.template({games: items});

        this.leftArrow = new Component(this.el.querySelector('.carousel__arrow_direction_left'));

        this.items = Array.from(this.el.querySelectorAll('.carousel__item'))
            .map((item) => new Component(item as HTMLElement));

        this.rightArrow = new Component(this.el.querySelector('.carousel__arrow_direction_right'));

        this.onArrowsClick();

        EventBus.subscribe(events.chengeStateCarousel, () => {

            this.updateCarousel();
            this.onItems();
        });

        this.updateCarousel();
        this.onItems();
    }

    private updateCarousel(): void {


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

                    this.items[i].removeClass('carousel__item_theme_center');
                    this.items[i].removeClass('carousel__item_theme_next');
                    this.items[i].addClass('carousel__item_theme_prev');

                    this.prevItem = new Component(this.el.querySelector('.carousel__item_theme_prev'));

                } else if (i > this.centerItemId) {

                    this.items[i].removeClass('carousel__item_theme_prev');
                    this.items[i].removeClass('carousel__item_theme_center');
                    this.items[i].addClass('carousel__item_theme_next');

                    this.nextItem = new Component(this.el.querySelector('.carousel__item_theme_next'));

                } else {

                    this.items[i].removeClass('carousel__item_theme_prev');
                    this.items[i].removeClass('carousel__item_theme_next');
                    this.items[i].addClass('carousel__item_theme_center');

                    this.centerItem = new Component(this.el.querySelector('.carousel__item_theme_center'));

                    this.parallax = new Parallax(this.centerItem, -4, 4);
                    this.parallax.onMouseMove();
                    this.parallax.degMainBackground();
                }

                this.items[i].show();

            } else {

                this.items[i].el.style.animationName = '';
                this.items[i].removeClass('carousel__item_theme_prev');
                this.items[i].removeClass('carousel__item_theme_next');
                this.items[i].removeClass('carousel__item_theme_center');
                this.items[i].hide();
            }
        }

    }

    private onArrowsClick(): void {
        this.leftArrow.on('click', this.inLeftCallback);

        window.addEventListener('keydown', (e) => {

            if (this.centerItemId > 0) {
                if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
                    this.inLeftCallback();
                }
            }

            if (this.centerItemId < this.countItems - 1) {
                if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
                    this.inRightCallback();
                }
            }
        });

        this.rightArrow.on('click', this.inRightCallback);
    }

    private onItems() {

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

        this.centerItem.el.style.animationName = 'in-right';
        this.prevItem.el.style.animationName = 'out-left';

        this.centerItemId -= 1;
        EventBus.publish(events.chengeStateCarousel);
    };

    private inRightCallback = () => {

        this.nextItem.el.style.animationName = 'out-right';
        this.centerItem.el.style.animationName = 'in-left';

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