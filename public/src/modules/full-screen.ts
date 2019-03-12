interface FsDocument extends HTMLDocument {
    fullscreenElement?: Element;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
    webkitFullscreenElement?: Element;
    msExitFullscreen?: () => void;
    mozCancelFullScreen?: () => void;
    webkitExitFullscreen?: () => void;
}

// export function isFullScreen(): boolean {
//     const fsDoc = <FsDocument> document;
//
//     return !!(fsDoc.fullscreenElement || fsDoc.mozFullScreenElement || fsDoc.webkitFullscreenElement || fsDoc.msFullscreenElement);
// }

interface FsDocumentElement extends HTMLElement {
    msRequestFullscreen?: () => void;
    mozRequestFullScreen?: () => void;
    webkitRequestFullscreen?: () => void;
}

export function activeFullScreen(): void {
    const fsDocElem = <FsDocumentElement> document.documentElement;

    if (fsDocElem.requestFullscreen)
        fsDocElem.requestFullscreen();
    else if (fsDocElem.msRequestFullscreen)
        fsDocElem.msRequestFullscreen();
    else if (fsDocElem.mozRequestFullScreen)
        fsDocElem.mozRequestFullScreen();
    else if (fsDocElem.webkitRequestFullscreen)
        fsDocElem.webkitRequestFullscreen();
}

export function cancselFullScreen(): void {
    const fsDoc = <FsDocument> document;

    if (fsDoc.exitFullscreen)
        fsDoc.exitFullscreen();
    else if (fsDoc.msExitFullscreen)
        fsDoc.msExitFullscreen();
    else if (fsDoc.mozCancelFullScreen)
        fsDoc.mozCancelFullScreen();
    else if (fsDoc.webkitExitFullscreen)
        fsDoc.webkitExitFullscreen();
}