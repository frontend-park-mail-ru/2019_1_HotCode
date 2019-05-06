'use strict';

import Component from '../baseComponent/index';
import {onDragAndDrop} from '../../modules/dragAndDrop';
import Timer = NodeJS.Timer;

class ScrollableBlock extends Component{

    private isRoot: boolean;

    constructor(el: HTMLElement, isRoot = false) {
        super(el);

        this.isRoot = isRoot;
    }

    public decorate(): void {
        const scrolable = Component.Create('div', ['scrollable__area']);
        const content = Component.Create('div', ['scrollable__content']);

        this.addClass('scrollable__wrapper');
        Array.from(this.el.children).map((child) => {
            content.append(new Component(child as HTMLElement));
        });
        scrolable.append(content);
        this.clear();
        this.append(scrolable);

        const scrolableStyle = window.getComputedStyle(scrolable.el);

        const scrolablePadding =
            parseFloat(scrolableStyle.paddingLeft) +
            parseFloat(scrolableStyle.paddingRight);

        const scrolableBorder =
            parseFloat(scrolableStyle.borderLeftWidth) +
            parseFloat(scrolableStyle.borderRightWidth);

        const scrollbarWidth = scrolable.el.offsetWidth - (scrolable.el.clientWidth) + 1;

        scrolable.el.style.width = `calc(100% + ${scrollbarWidth}px)`;


        if (!this.isRoot) {
            const scrollbar = Component.Create('div', ['scrollbar']);
            const scrollbarContainer = Component.Create('div', ['scrollbar-container']);

            scrollbarContainer.append(scrollbar);
            this.append(scrollbarContainer);

            scrollbar.el.style.height = (scrolable.el.clientHeight /*- 32*/) * 100 / content.el.clientHeight + '%';

            let timer: Timer = null;

            scrolable.el.onscroll = () => {
                clearTimeout(timer);
                scrollbarContainer.addClass('scrollbar-container_theme_visible');

                const scrollTop = scrolable.el.scrollTop;

                scrollbar.el.style.height = (scrolable.el.clientHeight /*- 32*/) * 100 / content.el.clientHeight + '%';
                scrollbar.el.style.top = scrollTop * 100 / content.el.clientHeight + '%';

                timer = setTimeout(() => {

                    scrollbarContainer.removeClass('scrollbar-container_theme_visible');
                }, 500);
            };

            scrolable.on('keydown', (e: KeyboardEvent) => {

                if (e.key === 'ArrowDown') {
                    scrolable.el.scrollBy(0, 10);
                }

                if (e.key === 'ArrowUp') {
                    scrolable.el.scrollBy(0, -10);
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

                        scrolable.el.scrollTo(
                            0,
                            scrollbar.el.offsetTop *
                                content.el.clientHeight /
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
}

export default ScrollableBlock;