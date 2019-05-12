'use strict';

import Component from "../../../../components/baseComponent/index";
import Page from '../../page';
import Game from "../../../../models/game";
import EventBus from '../../../../modules/event-bus';
import {events} from '../../../../modules/utils/events';
import Panel from '../../../../components/panel/panel';
import {onDragAndDrop} from '../../../../modules/dragAndDrop';
import TestCodeForm from '../../../../components/form/testCodeForm';


class MatchPage extends Page{

    private static template = require('./matchPage.pug');

    private gamePanels: Panel[];
    private editorPanel: Component;
    private editorLine: Component;
    private testCodeForm: TestCodeForm;

    constructor(parent: Component) {
        super(parent, 'Match - Game - WarScript');
    }

    public render(param: string[]): void {

        super.render();
        this.renderTmpl(MatchPage.template);

        const gameContainer = new Component(document.querySelector('.container_theme_game-menu'));
        const gameImageLogo = new Component(document.querySelector('.game-menu__right'));
        const gameContent = new Component(document.querySelector('.game-menu__left'));
        const gameHeader = new Component(document.querySelector('.game-menu__header'));
        const gameOptions = new Component(document.querySelector('.game-menu__options'));
        const gamePlayButton = new Component(document.querySelector('.button_theme_play'));

        gameContainer.addClass('container_theme_game-play');
        gameImageLogo.hide();
        gameContent.addClass('game-menu__left_theme_play');
        gameHeader.el.style.top = 3.5 + 'em';
        gameOptions.el.style.top = 4.5 + 'em';
        gamePlayButton.hide();

        this.gamePanels = Array.from(this.parent.el.querySelectorAll('.play__item'))
            .map((panel) => new Panel(panel as HTMLElement));

        this.editorPanel = new Component(this.parent.el.querySelector('.play__item_theme_editor'));
        this.editorLine = new Component(this.editorPanel.el.querySelector('.play__item__vetical-line__outline'));

        onDragAndDrop(this.editorLine, this.onMove);

        this.testCodeForm = new TestCodeForm(this.parent.el.querySelector('.form_theme_editor'));

        this.testCodeForm.code.setTheme('ace/theme/monokai');
        this.testCodeForm.code.setMode('ace/mode/javascript');
    }

    public clear(): void {
        this.parent.el.innerHTML = '';

        const gameContainer = new Component(document.querySelector('.container_theme_game-menu'));
        const gameImageLogo = new Component(document.querySelector('.game-menu__right'));
        const gameContent = new Component(document.querySelector('.game-menu__left'));
        const gameHeader = new Component(document.querySelector('.game-menu__header'));
        const gameOptions = new Component(document.querySelector('.game-menu__options'));
        const gamePlayButton = new Component(document.querySelector('.button_theme_play'));

        gameContainer.removeClass('container_theme_game-play');
        gameImageLogo.show();
        gameContent.removeClass('game-menu__left_theme_play');
        gameHeader.el.style.top = '';
        gameOptions.el.style.top = '';
        gamePlayButton.show();
    }

    private onMove = (shiftX: number) => {
        return (e: MouseEvent): void => {
            e.preventDefault();
            this.editorPanel.el.style.width =
                e.pageX -
                (this.editorPanel.el.offsetLeft +
                    shiftX) +
                'px';
        };
    };
}

export default MatchPage;