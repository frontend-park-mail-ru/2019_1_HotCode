'use strict';

import Component from "../baseComponent/index";
import Tab from '../tabbar/tab';
import EventBus from '../../modules/event-bus';


const carouselTmpl = require('./carousel.pug');

/**
 * Carousel Component for carousel
 * @extends {Component}
 */
class Carousel extends Component{

    private _clickCallback: (param?: any) => any;
    private _centerContent: Component;
    private _carouselItems: Tab[];

    private _clickRemover: {[key: string]: () => void};

    constructor(el: HTMLElement,
                callback = () => {},
                items: {[key: string]: string}[] = [],)
    {
        super(el);

        this.renderCarousel(items);

        this._clickCallback = callback;

        this.onChange();
    }

    public renderCarousel(items: {[key: string]: string | number}[]): void {
        this.el.innerHTML = carouselTmpl({games: items});

        this._centerContent = new Component(this.el.querySelector('input:checked+div+input+div .carusel__item'));

        this._carouselItems =
            Array.from(this.el.querySelectorAll('input[type="radio"]')).map(item => new Tab(<HTMLElement>item));
    }

    public onClick(): void {
        this._clickRemover = this._centerContent.on('click', this._clickCallback);

        EventBus.subscribe('chengeStateCarousel', () => {
            this._clickRemover.remover();
            this._centerContent = this.getActiveItem();
            this._clickRemover = this._centerContent.on('click', this._clickCallback);
        });
    }


    private getActiveItem(): Component {
        const prevItem = this._carouselItems.filter(item => item.isChecked())[0];
        return new Component((<Element>prevItem.el
            .nextSibling
            .nextSibling
            .nextSibling)
            .querySelector('.carusel__item')
        );
    }

    private onChange(): void {
        this.on('change', (event) => {

            if ((<HTMLInputElement>event.target).checked) {
                EventBus.publish('chengeStateCarousel', '');
            }
        });
    }
}

export default Carousel;