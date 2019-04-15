'use strict';

import Component from '../baseComponent/index';
import ImageInput from '../imageInput/imageInput';

class PhotoLoader extends Component{

    private static template = require('./photoLoader.pug');

    private loadPhotoButton: ImageInput;
    private loadImage: Component;
    private frame: Component;
    private containerOfImage: Component;
    private footer: Component;
    private content: Component;
    private dragText: Component;
    private sliderNE: Component;
    private cropButton: Component;
    private resultImage: Component;

    private resultFile64Field: string;
    private resultFileField: File;

    constructor(el: HTMLElement) {
        super(el);
    }

    get resultFile64(): string {
        return this.resultFile64Field;
    }


    get resultFile(): File {
        return this.resultFileField;
    }

    public render(): void {
        this.el.innerHTML = PhotoLoader.template();

        this.init();

        this.onDragAndDrop();

        this.onDragFrame();

        this.onDragSliders();

        this.onCropImage();
    }

    private init(): void {

        this.loadPhotoButton = new ImageInput(this.el.querySelector('.load-avatar'), () => {

            const avatar = (event.target as any).files[0];

            this.handleFile(avatar);
        });

        this.loadImage = new Component(this.el.querySelector('.photo-loader__resize__image'));

        this.frame = new Component(this.el.querySelector('.photo-loader__resize__frame'));
        this.containerOfImage = new Component(this.el.querySelector('.photo-loader__resize'));
        this.footer = new Component(this.el.querySelector('.photo-loader__footer'));

        this.content = new Component(this.el.querySelector('.photo-loader'));
        this.dragText = new Component(this.el.querySelector('.photo-loader__content'));
        this.sliderNE = new Component(
            this.el.querySelector('.photo-loader__resize__frame__sliders_direction_right-top'),
        );

        this.cropButton = new Component(this.el.querySelector('.button_theme_photo-loader'));
        this.resultImage = new Component(document.querySelector('.avatar__image'));
    }

    private onDragAndDrop(): void {

        ['dragenter', 'dragover', 'dragleave', 'drop'].map((eventName) => {
            this.content.on(eventName, this.preventDefaults);
        });

        ['dragenter', 'dragover'].map((eventName) => {
            this.content.on(eventName, this.highlight);
        });

        ['dragleave', 'drop'].map((eventName) => {
            this.content.on(eventName, this.unhighlight);
        });

        this.content.on('drop', this.handleDrop);

        this.loadPhotoButton.onChange();
    }

    private preventDefaults = (e: DragEvent): void => {
        e.preventDefault();
        e.stopPropagation();
    };

    private highlight = (): void => {
        this.content.addClass('photo-loader_theme_drag');
    };

    private unhighlight = (): void => {
        this.content.removeClass('photo-loader_theme_drag');
    };

    private handleDrop = (e: DragEvent) => {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        this.handleFile(file);
    };

    private handleFile = (file: File) => {
        this.containerOfImage.show();
        this.footer.show();

        if (file && file.type.startsWith('image/')) {

            const reader = new FileReader();
            reader.onload = ((aImg) => {
                return (e: Event) => {

                    (aImg as HTMLImageElement).src = (e.target as any).result;
                    aImg.onload = () => {
                        (aImg as HTMLImageElement).src = this.resizeImage(
                            aImg as HTMLImageElement,
                            aImg.offsetWidth,
                            aImg.offsetHeight,
                        );
                    };
                };
            })(this.loadImage.el);
            reader.readAsDataURL(file);
        }
        this.resultFileField = this.loadPhotoButton.getFile();

        this.frame.el.style.width = 25 + '%';
        this.frame.el.style.left = 50 + '%';
        this.frame.el.style.top = 50 + '%';
    };

    private resizeImage = (image: HTMLImageElement, newWidth: number, newHeight: number) => {
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(image, 0, 0, newWidth, newHeight);
        return canvas.toDataURL('image/jpeg');
    };

    private onDragFrame(): void {
        const parent = new Component(document.querySelector('.container_theme_modal')); // TODO убрать этот костыль

        this.frame.on('mousedown', (mouseEvent: MouseEvent) => {
            mouseEvent.preventDefault();
            const coords = this.getCoords(this.frame.el);
            const shiftX = mouseEvent.pageX - coords.left;
            const shiftY = mouseEvent.pageY - coords.top;

            const maxLeft = this.containerOfImage.el.offsetWidth - this.frame.el.offsetWidth / 2;
            const minLeft = this.frame.el.offsetWidth / 2;
            const maxTop = this.containerOfImage.el.offsetHeight - this.frame.el.offsetHeight / 2;
            const minTop = this.frame.el.offsetHeight / 2;

            const moveAt = (e: MouseEvent) => {
                e.preventDefault();

                const newLeft =
                    e.pageX -
                    (this.containerOfImage.el.offsetLeft +
                        parent.el.offsetLeft -
                        parent.el.offsetWidth / 2 +
                        shiftX);

                const newTop =
                    e.pageY -
                    (this.containerOfImage.el.offsetTop +
                        parent.el.offsetTop -
                        parent.el.offsetHeight / 2 +
                        shiftY);

                if (newLeft >= minLeft && newLeft <= maxLeft) {

                    this.frame.el.style.left = newLeft + 'px';
                }
                if (newTop >= minTop && newTop <= maxTop) {

                    this.frame.el.style.top = newTop + 'px';
                }
            };

            const remover = this.containerOfImage.on('mousemove', moveAt);

            this.frame.el.onmouseup = () => {
                remover.remover();
                this.frame.el.onmouseup = null;
            };

        });
        this.frame.el.ondragstart = () => {
            return false;
        };
    }

    private onDragSliders(): void {
        const parent = new Component(document.querySelector('.container_theme_modal')); // TODO убрать этот костыль

        this.sliderNE.on('mousedown', (mouseEvent: MouseEvent) => {
            mouseEvent.preventDefault();
            mouseEvent.stopPropagation();
            const coords = this.getCoords(this.sliderNE.el);
            const shiftX = mouseEvent.pageX - coords.left;

            const moveAt = (e: MouseEvent) => {
                e.preventDefault();
                this.frame.el.style.width =
                    e.pageX -
                    (this.containerOfImage.el.offsetLeft +
                        parent.el.offsetLeft -
                        parent.el.offsetWidth / 2 +
                        this.frame.el.offsetLeft -
                        this.frame.el.offsetWidth / 2 +
                        shiftX) +
                    'px';
            };

            document.addEventListener('mousemove', moveAt);

            document.onmouseup = () => {
                document.removeEventListener('mousemove', moveAt);
                document.onmouseup = null;
            };

        });
        this.sliderNE.el.ondragstart = () => {
            return false;
        };
    }

    private getCoords = (elem: HTMLElement) => {
        const box = elem.getBoundingClientRect();
        return {
            top: box.top + pageYOffset + elem.offsetWidth / 2,
            left: box.left + pageXOffset + elem.offsetHeight / 2,
        };
    };

    private onCropImage(): void {

        this.cropButton.on('click', () => {

            this.resultImage.show();
            this.resultFile64Field = this.cropImage(
                this.loadImage.el as HTMLImageElement,
                this.frame.el.offsetLeft - this.frame.el.offsetWidth / 2,
                this.frame.el.offsetTop - this.frame.el.offsetHeight / 2,
                this.frame.el.offsetWidth,
                this.frame.el.offsetHeight,
            );
            (this.resultImage.el as HTMLImageElement).src = this.resultFile64Field;
        });
    }

    private cropImage = (image: HTMLImageElement, x: number, y: number, newWidth: number, newHeight: number) => {
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(image, 0, 0, newWidth, newHeight);
        ctx.drawImage(image, x, y, newWidth, newHeight, 0, 0, newWidth, newHeight);
        return canvas.toDataURL('image/jpeg');
    };
}

export default PhotoLoader;