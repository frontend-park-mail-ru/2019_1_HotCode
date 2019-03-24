'use strict';

import Component from "../../../../components/baseComponent/index";
import Page from '../../page';
import TestCodeForm from '../../../../components/form/testCodeForm';
import PingPong from '../../../../components/games/ping-pong/ping-pong';
import {runCode} from '../../../../modules/game/utils';

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

        this.testCodeForm = new TestCodeForm(this.parent.el.querySelector('.play__code__form'));
        this.pingPong = new PingPong(this.parent.el.querySelector('.play__screen__game'));

        this.testCodeForm.onSubmit(event => {
            event.preventDefault();

            const code = this.testCodeForm.codeField.getValue();

            if (this.testCodeForm.validate()) {

                this.pingPong.render(runCode(code).states);
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