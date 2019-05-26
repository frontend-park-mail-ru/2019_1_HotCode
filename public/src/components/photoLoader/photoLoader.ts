'use strict';

import Component from '../baseComponent/index';
import ImageInput from '../imageInput/imageInput';
import EventBus from '../../modules/event-bus';
import {events} from '../../modules/utils/events';
import {onDragAndDrop} from '../../modules/dragAndDrop';
import User from '../../models/user';
import AvatarService from '../../services/avatar-service';
import Alert from '../alert/alert';
import Message from '../../utils/message';
import UserService from '../../services/user-service';

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
    private sliderNW: Component;
    private sliderSE: Component;
    private sliderSW: Component;
    private cropButton: Component;
    // private resultImage: Component;

    private resultFileField: File;

    constructor(el: HTMLElement) {
        super(el);
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
        this.sliderNW = new Component(
            this.el.querySelector('.photo-loader__resize__frame__sliders_direction_left-top'),
        );
        this.sliderSE = new Component(
            this.el.querySelector('.photo-loader__resize__frame__sliders_direction_right-bottom'),
        );
        this.sliderSW = new Component(
            this.el.querySelector('.photo-loader__resize__frame__sliders_direction_left-bottom'),
        );

        this.cropButton = new Component(this.el.querySelector('.button_theme_photo-loader'));
        // this.resultImage = new Component(document.querySelector('.menu__item__img'));
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
                };
            })(this.loadImage.el);
            reader.readAsDataURL(file);
        }

        this.frame.el.style.width = 25 + '%';
        this.frame.el.style.left = 50 + '%';
        this.frame.el.style.top = 50 + '%';
    };

    private onDragFrame(): void {
        const parent = new Component(document.querySelector('.container_theme_straight')); // TODO убрать этот костыль

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

    private getCoords = (elem: HTMLElement) => {
        const box = elem.getBoundingClientRect();
        return {
            top: box.top + pageYOffset + elem.offsetHeight / 2,
            left: box.left + pageXOffset + elem.offsetWidth / 2,
        };
    };

    private onDragSliders(): void {
        const parent = new Component(document.querySelector('.container_theme_straight')); // TODO убрать этот костыль

        const moveAtInLeft = (target: Component) => {
            return (shiftX: number) => {
                return (e: MouseEvent) => {
                    e.preventDefault();
                    this.frame.el.style.width =
                        2 *
                        (this.frame.el.offsetLeft -
                            (e.pageX -
                                (this.containerOfImage.el.offsetLeft +
                                    parent.el.offsetLeft -
                                    parent.el.offsetWidth / 2 +
                                    shiftX -
                                    target.el.offsetWidth / 2))) +
                        'px';
                };
            };
        };

        const moveAtInRight = (target: Component) => {
            return (shiftX: number) => {
                return (e: MouseEvent) => {
                    e.preventDefault();
                    this.frame.el.style.width =
                        e.pageX -
                        (this.containerOfImage.el.offsetLeft +
                            parent.el.offsetLeft -
                            parent.el.offsetWidth / 2 +
                            this.frame.el.offsetLeft -
                            this.frame.el.offsetWidth / 2 +
                            shiftX -
                            target.el.offsetWidth / 2) +
                        'px';
                };
            };
        };

        [this.sliderNE, this.sliderSE].map((slider) => {
            onDragAndDrop(slider, moveAtInRight(slider));
        });

        [this.sliderNW, this.sliderSW].map((slider) => {
            onDragAndDrop(slider, moveAtInLeft(slider));
        });
    }

    private onCropImage(): void {

        this.cropButton.on('click', () => {

            // this.resultImage.show();
            const base64 = this.cropImage(
                this.loadImage.el as HTMLImageElement,
                this.frame.el.offsetLeft - this.frame.el.offsetWidth / 2,
                this.frame.el.offsetTop - this.frame.el.offsetHeight / 2,
                this.frame.el.offsetWidth,
                this.frame.el.offsetHeight,
            );
            // (this.resultImage.el as HTMLImageElement).src = base64;
            this.resultFileField = this.dataURItoFile(base64, 'avatar.jpg');

            this.submitImage();
        });
    }

    private dataURItoFile(dataURI: string, filename: string): File {
        const arr = dataURI.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type: mime});
    }

    private cropImage = (
        image: HTMLImageElement,
        x: number,
        y: number,
        newWidth: number,
        newHeight: number,
    ): string => {

        newWidth = newWidth * image.naturalWidth / image.width;
        newHeight = newHeight * image.naturalHeight / image.height;
        x = x * image.naturalWidth / image.width;
        y = y * image.naturalHeight / image.height;

        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(image, 0, 0, newWidth, newHeight);
        ctx.drawImage(image, x, y, newWidth, newHeight, 0, 0, newWidth, newHeight);
        return canvas.toDataURL('image/jpeg');
    };


    private submitImage = () => {
        AvatarService.sendAvatar(this.resultFileField)
            .then((resp) => {
                if (User.avatar !== resp.photo_uuid) {
                    return resp.photo_uuid;
                }
                return '';
            })
            .catch(() => {
                Alert.alert(Message.fileFormatError(), true);
            })
            .then((photoUuid: string) => {

                const newUserData = {photo_uuid: photoUuid};

                return UserService.edit(newUserData);
            })
            .then(() => {

                Alert.alert(Message.successfulUpdate());
                UserService.me();
                EventBus.publish(events.onCloseModal); // TODO Костыль
            })
            .catch((err) => {

                if (err && err.message) {

                    Alert.alert(Message.accessError(), true);
                    EventBus.publish(events.openSignIn, '');

                }
            });
    };
}

export default PhotoLoader;