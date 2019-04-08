'use strict';

import Component from "../../../../components/baseComponent/index";
import Page from '../../page';
import TestCodeForm from '../../../../components/form/testCodeForm';
import PingPong from '../../../../components/games/ping-pong/ping-pong';
import {runCode} from '../../../../modules/game/game';
import Game from "../../../../models/game";
import Panel from '../../../../components/panel/panel';

const defaultCode = `{
    const dx = ball.x - me.x;
    const dy = ball.y - me.y;
    
    
    me.setMoveVector(5, dx, dy);
}`;

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

        this.gamePanels = Array.from(this.parent.el.querySelectorAll('.play__item'))
            .map((panel) => new Panel(panel as HTMLElement));

        this.editorPanel = new Component(this.parent.el.querySelector('.play__item_theme_editor'));
        this.editorLine = new Component(this.editorPanel.el.querySelector('.play__item__vetical-line__outline'));

        this.onDragNDrop();

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

    private onDragNDrop(): void {
        this.editorLine.el.onmousedown = (event) => {
            document.addEventListener('mousemove', this.onMove);

            document.onmouseup = (e) => {
                document.removeEventListener('mousemove', this.onMove);
                document.onmouseup = null;
            };
        };
        this.editorLine.el.ondragstart = () => {
            return false;
        };
    }

    private onMove = (e: MouseEvent): void => {
        this.editorPanel.el.style.width = e.pageX - this.editorPanel.el.offsetLeft + 'px';
    };
}

export default GamePage;