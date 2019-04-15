interface IFsDocument extends HTMLDocument {
    fullscreenElement?: Element;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
    webkitFullscreenElement?: Element;
    msExitFullscreen?: () => void;
    mozCancelFullScreen?: () => void;
    webkitExitFullscreen?: () => void;
}

export function isFullScreen(): boolean {
    const fsDoc = document as IFsDocument;

    return !!(fsDoc.fullscreenElement ||
        fsDoc.mozFullScreenElement ||
        fsDoc.webkitFullscreenElement ||
        fsDoc.msFullscreenElement);
}

interface IFsDocumentElement extends HTMLElement {
    msRequestFullscreen?: () => void;
    mozRequestFullScreen?: () => void;
    webkitRequestFullscreen?: () => void;
}

export function activeFullScreen(): void {
    const fsDocElem = document.documentElement as IFsDocumentElement;

    if (!isFullScreen()) {

        if (fsDocElem.requestFullscreen) {
            fsDocElem.requestFullscreen();
            return;
        }

        if (fsDocElem.msRequestFullscreen) {
            fsDocElem.msRequestFullscreen();
            return;
        }

        if (fsDocElem.mozRequestFullScreen) {
            fsDocElem.mozRequestFullScreen();
            return;
        }

        if (fsDocElem.webkitRequestFullscreen) {
            fsDocElem.webkitRequestFullscreen();
            return;
        }
    }
}

export function cancselFullScreen(): void {
    const fsDoc = document as IFsDocument;

    if (isFullScreen()) {

        if (fsDoc.exitFullscreen) {
            fsDoc.exitFullscreen();
            return;
        }

        if (fsDoc.msExitFullscreen) {
            fsDoc.msExitFullscreen();
            return;
        }

        if (fsDoc.mozCancelFullScreen) {
            fsDoc.mozCancelFullScreen();
            return;
        }

        if (fsDoc.webkitExitFullscreen) {
            fsDoc.webkitExitFullscreen();
            return;
        }
    }
}