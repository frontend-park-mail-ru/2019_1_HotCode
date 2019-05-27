'use strict';

import Component from '../baseComponent/index';
import Checkbox from '../checkbox/checkbox';
import {activeFullScreen, cancselFullScreen} from '../../modules/full-screen';

class OptionsMenu extends Component{

    private static template = require('./optionsMenu.pug');

    private openButton: Checkbox;
    private fullScreenButton: Checkbox;
    private soundButton: Checkbox;
    private musicButton: Checkbox;

    constructor(el: HTMLElement) {
        super(el);

        this.render();
    }

    public render(): void {
        this.el.innerHTML = OptionsMenu.template();

        const openButtonSVG = new Component(this.el.querySelector('.gear-icon_theme_main'));
        const openButtonSVGPath = new Component(this.el.querySelector('.gear-icon__path_theme_main'));

        this.openButton = new Checkbox(this.el.querySelector('#optionsMenuMainButton'),
            () => {

                openButtonSVG.addClass('gear-icon_theme_rotate');
                openButtonSVGPath.addClass('gear-icon__path_theme_rotate');
            },
            () => {

                openButtonSVG.removeClass('gear-icon_theme_rotate');
                openButtonSVGPath.removeClass('gear-icon__path_theme_rotate');
            }
        );
        this.openButton.onChange();


        const fullScreenIconArrow1 = new Component(this.el.querySelector('.full-icon_1'));
        const fullScreenIconArrow2 = new Component(this.el.querySelector('.full-icon_2'));
        const fullScreenIconArrow3 = new Component(this.el.querySelector('.full-icon_3'));
        const fullScreenIconArrow4 = new Component(this.el.querySelector('.full-icon_4'));

        this.fullScreenButton = new Checkbox(this.el.querySelector('#fullScreenButton'),
            () => {

                fullScreenIconArrow1.addClass('full-icon_1_theme_anim');
                fullScreenIconArrow2.addClass('full-icon_2_theme_anim');
                fullScreenIconArrow3.addClass('full-icon_3_theme_anim');
                fullScreenIconArrow4.addClass('full-icon_4_theme_anim');
                activeFullScreen();
            },
            () => {

                fullScreenIconArrow1.removeClass('full-icon_1_theme_anim');
                fullScreenIconArrow2.removeClass('full-icon_2_theme_anim');
                fullScreenIconArrow3.removeClass('full-icon_3_theme_anim');
                fullScreenIconArrow4.removeClass('full-icon_4_theme_anim');
                cancselFullScreen()
            }
        );
        this.fullScreenButton.onChange();


        const soundLine1AnimOff = new Component(this.el.querySelector('#line1Off'));
        const soundLine1AnimOn = new Component(this.el.querySelector('#line1On'));
        const soundLine2AnimOff = new Component(this.el.querySelector('#line2Off'));
        const soundLine2AnimOn = new Component(this.el.querySelector('#line2On'));

        this.soundButton = new Checkbox(this.el.querySelector('#soundButton'),
            () => {

                (soundLine1AnimOff.el as any).beginElement();
                (soundLine2AnimOff.el as any).beginElement();
            },
            () => {

                (soundLine1AnimOn.el as any).beginElement();
                (soundLine2AnimOn.el as any).beginElement();
            }
        );
        this.soundButton.onChange();


        const musicOnX = new Component(this.el.querySelector('#musicOnX'));
        const musicOnY = new Component(this.el.querySelector('#musicOnY'));
        const musicOffX = new Component(this.el.querySelector('#musicOffX'));
        const musicOffY = new Component(this.el.querySelector('#musicOffY'));

        this.musicButton = new Checkbox(this.el.querySelector('#musicButton'),
            () => {

                (musicOnX.el as any).beginElement();
                (musicOnY.el as any).beginElement();
            },
            () => {

                (musicOffX.el as any).beginElement();
                (musicOffY.el as any).beginElement();
            }
        );
        this.musicButton.onChange();


    }

    public clear(): void {
        super.clear();

        this.openButton = null;
        this.fullScreenButton = null;
        this.soundButton = null;
        this.musicButton = null;
    }
}

export default OptionsMenu;