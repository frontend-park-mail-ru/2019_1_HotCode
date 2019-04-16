'use strict';

import Component from '../components/baseComponent/index';

export const onDragAndDrop = (
    target: Component,
    onMove: (shiftX: number, shiftY?: number) => (e: MouseEvent) => void,
) => {
    target.on('mousedown', (mouseEvent: MouseEvent) => {
        mouseEvent.preventDefault();
        mouseEvent.stopPropagation();
        const coords = getCoords(target.el);
        const shiftX = mouseEvent.pageX - coords.left;
        const shiftY = mouseEvent.pageY - coords.top;

        const moveAt = onMove(shiftX, shiftY);

        document.addEventListener('mousemove', moveAt);

        document.onmouseup = () => {
            document.removeEventListener('mousemove', moveAt);
            document.onmouseup = null;
        };

    });
    target.el.ondragstart = () => {
        return false;
    };
};

const getCoords = (elem: HTMLElement) => {
    const box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset,
    };
};