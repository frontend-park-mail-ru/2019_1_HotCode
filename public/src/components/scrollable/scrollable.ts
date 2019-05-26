'use strict';

import Component from '../baseComponent/index';
import {onDragAndDrop} from '../../modules/dragAndDrop';
import Timer = NodeJS.Timer;

class ScrollableBlock extends Component{

    private isRoot: boolean;

    private scrolableField: Component;
    private contentField: Component;
    private onEndScrollFunc: () => Promise<any>;

    private isEndOfScroll: boolean;

    constructor(el: HTMLElement, isRoot = false) {
        super(el);

        this.isRoot = isRoot;
        this.isEndOfScroll = false;
    }


    get scrolable(): Component {
        return this.scrolableField;
    }

    set scrolable(value: Component) {
        this.scrolableField = value;
    }

    get content(): Component {
        return this.contentField;
    }

    set content(value: Component) {
        this.contentField = value;
    }

    get onEndScroll(): () => Promise<any> {
        return this.onEndScrollFunc;
    }

    set onEndScroll(value: () => Promise<any>) {
        this.onEndScrollFunc = value;
        this.checkOnEnd();
    }

    public decorate(): void {
        this.scrolableField = Component.Create('div', ['scrollable__area']);
        this.contentField = Component.Create('div', ['scrollable__content']);

        this.addClass('scrollable__wrapper');
        Array.from(this.el.children).map((child) => {
            this.contentField.append(new Component(child as HTMLElement));
        });
        this.scrolableField.append(this.contentField);
        this.clear();
        this.append(this.scrolableField);

        const scrolableStyle = window.getComputedStyle(this.scrolableField.el);

        const scrolablePadding =
            parseFloat(scrolableStyle.paddingLeft) +
            parseFloat(scrolableStyle.paddingRight);

        const scrolableBorder =
            parseFloat(scrolableStyle.borderLeftWidth) +
            parseFloat(scrolableStyle.borderRightWidth);

        const scrollbarWidth = this.scrolableField.el.offsetWidth - (this.scrolableField.el.clientWidth) + 1;

        this.scrolableField.el.style.width = `calc(100% + ${scrollbarWidth}px)`;


        if (!this.isRoot) {
            const scrollbar = Component.Create('div', ['scrollbar']);
            const scrollbarContainer = Component.Create('div', ['scrollbar-container']);

            scrollbarContainer.append(scrollbar);
            this.append(scrollbarContainer);

            scrollbar.el.style.height = (this.scrolableField.el.clientHeight /*- 32*/) *
                100 / this.contentField.el.clientHeight + '%';

            if (this.onEndScroll) {

                this.checkOnEnd();
            }

            let timer: Timer = null;

            this.scrolableField.el.onscroll = () => {
                clearTimeout(timer);
                scrollbarContainer.addClass('scrollbar-container_theme_visible');

                const scrollTop = this.scrolableField.el.scrollTop;


                scrollbar.el.style.height = (this.scrolableField.el.clientHeight /*- 32*/) *
                    100 / this.contentField.el.clientHeight + '%';
                scrollbar.el.style.top = scrollTop * 100 / this.contentField.el.clientHeight + '%';

                if (this.onEndScroll) {

                    this.checkOnEnd();
                }

                timer = setTimeout(() => {

                    scrollbarContainer.removeClass('scrollbar-container_theme_visible');
                }, 500);
            };

            this.scrolableField.on('keydown', (e: KeyboardEvent) => {

                if (e.key === 'ArrowDown') {
                    this.scrolableField.el.scrollBy(0, 10);
                }

                if (e.key === 'ArrowUp') {
                    this.scrolableField.el.scrollBy(0, -10);
                }
            });

            const onMove = (shiftX: number, shiftY: number) => {

                return (event: MouseEvent) => {
                    const minY = 0;
                    const maxY = scrollbarContainer.el.offsetHeight - scrollbar.el.offsetHeight;

                    const newY =
                        event.pageY -
                        (scrollbarContainer.top() -
                            scrollbarContainer.el.offsetHeight / 2 /*+ 16*/ +
                            shiftY);

                    if (newY >= minY && newY <= maxY) {

                        this.scrolableField.el.scrollTo(
                            0,
                            scrollbar.el.offsetTop *
                            this.contentField.el.clientHeight /
                                scrollbarContainer.el.offsetHeight,
                        );
                        scrollbar.el.style.top = newY + 'px';
                    }
                };
            };

            onDragAndDrop(scrollbar, onMove,
                () => {
                    scrollbar.addClass('scrollbar_theme_yellow');
                    scrollbarContainer.addClass('scrollbar-container_theme_visible');
                },
                () => {
                    scrollbar.removeClass('scrollbar_theme_yellow');
                    scrollbarContainer.removeClass('scrollbar-container_theme_visible');
                });
        }

    }

    private checkOnEnd(): void {
        if (this.onEndScroll &&
            !this.isEndOfScroll &&
            this.scrolableField.el.scrollHeight -
            this.scrolableField.el.clientHeight -
            this.scrolableField.el.scrollTop < 30) {

            this.isEndOfScroll = true;

            this.onEndScroll()
                .then(() => {

                    this.isEndOfScroll = false;
                    this.checkOnEnd();
                });
        }
    }
}

export default ScrollableBlock;