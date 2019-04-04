'use strict';

import Component from "../../../../components/baseComponent/index";
import Page from '../../page';
import TestCodeForm from '../../../../components/form/testCodeForm';
import PingPong from '../../../../components/games/ping-pong/ping-pong';
import {runCode} from '../../../../modules/game/game';
import Game from "../../../../models/game";

const defaultCode = `{
    const dx = ball.x - me.x;
    const dy = ball.y - me.y;
    
    
    me.setMoveVector(5, dx, dy);
}`;

class GamePage extends Page{

    private static template = require('./gamePage.pug');

    private testCodeForm: TestCodeForm;
    private pingPong: PingPong;

    constructor(parent: Component) {
        super(parent, 'Game - WarScript');
    }

    public render(): void {
        super.render();
        this.renderTmpl(GamePage.template);

        this.testCodeForm = new TestCodeForm(this.parent.el.querySelector('.form_theme_editor'));

        this.testCodeForm.code.setValue(Game.codeExample);

        this.testCodeForm.code.setTheme('ace/theme/monokai');
        this.testCodeForm.code.setMode('ace/mode/javascript');

        this.pingPong = new PingPong(this.parent.el.querySelector('.play__item__content_theme_screen'));

        this.testCodeForm.onSubmit((event) => {
            event.preventDefault();

            const code = this.testCodeForm.code.getValue();

            if (this.testCodeForm.validate()) {

                this.pingPong.render(runCode(code));
            }
        });
    }



    public clear(): void {
        this.parent.el.innerHTML = '';

        this.testCodeForm = null;
        this.pingPong = null;
    }
}

export default GamePage;