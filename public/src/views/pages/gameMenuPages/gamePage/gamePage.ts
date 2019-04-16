'use strict';

import Component from "../../../../components/baseComponent/index";
import Page from '../../page';
import TestCodeForm from '../../../../components/form/testCodeForm';
import PingPong from '../../../../components/games/ping-pong/ping-pong';
import {runCode} from '../../../../modules/game/game';
import Game from "../../../../models/game";
import Panel from '../../../../components/panel/panel';
import {onDragAndDrop} from '../../../../modules/dragAndDrop';

class GamePage extends Page{

    private static template = require('./gamePage.pug');

    private gamePanels: Panel[];
    private editorPanel: Component;
    private editorLine: Component;
    private testCodeForm: TestCodeForm;
    private pingPong: PingPong;
    private rulesContent: Component;

    constructor(parent: Component) {
        super(parent, 'Game - WarScript');
    }

    public render(): void {
        super.render();
        this.renderTmpl(GamePage.template);

        const gameContainer = new Component(document.querySelector('.container_theme_game-menu'));
        const gameImageLogo = new Component(document.querySelector('.game-menu__main__content-right'));
        const gameContent = new Component(document.querySelector('.game-menu__main__content-left'));

        gameContainer.addClass('container_theme_game-play');
        gameImageLogo.hide();
        gameContent.addClass('game-menu__main__content-left_theme_play');

        this.gamePanels = Array.from(this.parent.el.querySelectorAll('.play__item'))
            .map((panel) => new Panel(panel as HTMLElement));

        this.editorPanel = new Component(this.parent.el.querySelector('.play__item_theme_editor'));
        this.editorLine = new Component(this.editorPanel.el.querySelector('.play__item__vetical-line__outline'));

        onDragAndDrop(this.editorLine, this.onMove);

        this.rulesContent = new Component(this.parent.el.querySelector('.play__item__content_theme_rules'));
        this.rulesContent.el.innerHTML = Game.rules;

        this.testCodeForm = new TestCodeForm(this.parent.el.querySelector('.form_theme_editor'));

        this.testCodeForm.code.setValue(Game.codeExample);

        this.testCodeForm.code.setTheme('ace/theme/monokai');
        this.testCodeForm.code.setMode('ace/mode/javascript');

        this.pingPong = new PingPong(this.parent.el.querySelector('.play__item__content_theme_screen'));

        this.testCodeForm.onSubmit((event) => {
            event.preventDefault();

            const code = this.testCodeForm.code.getValue();

            if (this.testCodeForm.validate()) {

                this.pingPong.init(runCode(code));
            }
        });
    }

    public clear(): void {
        this.parent.el.innerHTML = '';

        this.testCodeForm = null;
        this.pingPong = null;
    }

    private onMove = (shiftX: number) => {
        return (e: MouseEvent): void => {
            e.preventDefault();
            this.editorPanel.el.style.width =
                e.pageX -
                (this.editorPanel.el.offsetLeft +
                    shiftX -
                    this.editorLine.el.offsetWidth / 4) +
                'px';
        };
    };
}

export default GamePage;