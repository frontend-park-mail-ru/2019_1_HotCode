'use strict';

import Component from '../baseComponent/index';
import Checkbox from '../checkbox/checkbox';
import {activeFullScreen, cancselFullScreen} from '../../modules/full-screen';
import EventBus from '../../modules/event-bus';
import {events} from '../../modules/utils/events';

class OptionsMenu extends Component{

    private static template = require('./optionsMenu.pug');

    private openButton: Checkbox;
    private fullScreenButton: Checkbox;
    private soundButton: Checkbox;
    private musicButton: Checkbox;
    private magicButton: Checkbox;

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


        const magicS1 = new Component(this.el.querySelector('#magicS1'));
        const magicL1 = new Component(this.el.querySelector('#magicL1'));
        const magicS2 = new Component(this.el.querySelector('#magicS2'));
        const magicL2 = new Component(this.el.querySelector('#magicL2'));
        const magicS3 = new Component(this.el.querySelector('#magicS3'));
        const magicL3 = new Component(this.el.querySelector('#magicL3'));
        const magicS4 = new Component(this.el.querySelector('#magicS4'));
        const magicL4 = new Component(this.el.querySelector('#magicL4'));
        const magicS5 = new Component(this.el.querySelector('#magicS5'));
        const magicL5 = new Component(this.el.querySelector('#magicL5'));
        const magicS6 = new Component(this.el.querySelector('#magicS6'));
        const magicL6 = new Component(this.el.querySelector('#magicL6'));
        const magicS7 = new Component(this.el.querySelector('#magicS7'));
        const magicL7 = new Component(this.el.querySelector('#magicL7'));

        const magicOnX = new Component(this.el.querySelector('#magicOnX'));
        const magicOnY = new Component(this.el.querySelector('#magicOnY'));
        const magicOffX = new Component(this.el.querySelector('#magicOffX'));
        const magicOffY = new Component(this.el.querySelector('#magicOffY'));

        this.magicButton = new Checkbox(this.el.querySelector('#magicButton'),
            () => {

                (magicOffX.el as any).beginElement();
                (magicOffY.el as any).beginElement();
                (magicS1.el as any).beginElement();
                (magicS2.el as any).beginElement();
                (magicS3.el as any).beginElement();
                (magicS4.el as any).beginElement();
                (magicS5.el as any).beginElement();
                (magicS6.el as any).beginElement();
                (magicS7.el as any).beginElement();

                EventBus.publish(events.onStopGenerateGlitches);
            },
            () => {

                (magicOnX.el as any).beginElement();
                (magicOnY.el as any).beginElement();
                (magicL1.el as any).beginElement();
                (magicL2.el as any).beginElement();
                (magicL3.el as any).beginElement();
                (magicL4.el as any).beginElement();
                (magicL5.el as any).beginElement();
                (magicL6.el as any).beginElement();
                (magicL7.el as any).beginElement();

                EventBus.publish(events.onContinueGenerateGlitches);
            }
        );
        this.magicButton.onChange();
    }

    public clear(): void {
        super.clear();

        this.openButton = null;
        this.fullScreenButton = null;
        this.soundButton = null;
        this.musicButton = null;
        this.magicButton = null;
    }
}

export default OptionsMenu;