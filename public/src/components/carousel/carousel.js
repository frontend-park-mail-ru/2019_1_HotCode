'use strict';

import Component from "../baseComponent";
import Tab from '../tabbar/tab';
import EventBus from '../../modules/event-bus'

/**
 * Carousel Component for carousel
 * @extends {Component}
 */
class Carousel extends Component{
    constructor(el, callback = () => {}) {
        super(el);

        this.mainCallback = callback;
        this.mainContent = new Component(this.el.querySelector('input:checked+div+input+div .carusel__item'));
        this._mainCarouselItems =
            Array.from(this.el.querySelectorAll('input[type="radio"]')).map(item => new Tab(item));

        this.onChange();
    }

    getActiveItem() {
        const prevItem = this._mainCarouselItems.filter(item => item.isChecked())[0];
        return new Component(prevItem.el
            .nextSibling
            .nextSibling
            .nextSibling
            .querySelector('.carusel__item')
        );
    }

    onChange() {
        this.on('change', (event) => {
            if (event.target.checked) {
                EventBus.publish('chengeStateCarousel', '');
            }
        });
    }

    onClick() {
        EventBus.subscribe('chengeStateCarousel', () => {
            this.mainContent.off('click', this.mainCallback);
            this.mainContent = this.getActiveItem();
            this.mainContent.on('click', this.mainCallback);
        });
        this.mainContent.on('click', this.mainCallback);
    }
}

export default Carousel;