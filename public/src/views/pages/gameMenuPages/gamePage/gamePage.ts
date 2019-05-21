'use strict';

import Component from "../../../../components/baseComponent/index";
import Page from '../../page';
import TestCodeForm from '../../../../components/form/testCodeForm';
import PingPong from '../../../../components/games/ping-pong/ping-pong';
import {runCode} from '../../../../modules/game/game';
import Game from "../../../../models/game";
import Panel from '../../../../components/panel/panel';
import {onDragAndDrop} from '../../../../modules/dragAndDrop';
import ScrollableBlock from '../../../../components/scrollable/scrollable';
import EventBus from '../../../../modules/event-bus';
import {events} from '../../../../modules/utils/events';
import Button from '../../../../components/button/button';
import BotsService from '../../../../services/bots-service';

class GamePage extends Page{

    private static template = require('./gamePage.pug');

    private gamePanels: Panel[];
    private leftPanel: Component;
    private verticalLine: Component;
    private testCodeForm: TestCodeForm;
    private testCodeButton: Button;
    private pingPong: PingPong;
    private rulesContent: Component;

    private onRulesChange: {[key: string]: () => void};
    private onCodeChange: {[key: string]: () => void};
    private onBotCodeChange: {[key: string]: () => void};

    constructor(parent: Component) {
        super(parent, 'Game - WarScript');
    }

    public render(): void {
        super.render();
        this.renderTmpl(GamePage.template);

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

        this.leftPanel = new Component(this.parent.el.querySelector('.game__container-item_theme_left'));
        this.verticalLine = new Component(this.leftPanel.el.querySelector('.play__item__vetical-line__outline'));

        onDragAndDrop(this.verticalLine, this.onMove);

        this.rulesContent = new Component(this.parent.el.querySelector('.play__item__content_theme_rules'));

        this.onRulesChange = EventBus.subscribe(events.onRulesChange, () => {

            this.rulesContent.el.innerHTML = Game.rules;
            const rulesContent = new ScrollableBlock(this.parent.el.querySelector('.play__item__content_theme_rules'));
            rulesContent.decorate();
        });

        if (Game.rules) {

            EventBus.publish(events.onRulesChange);
        }


        this.testCodeForm = new TestCodeForm(this.parent.el.querySelector('.form_theme_editor'));

        this.testCodeForm.code.setTheme('ace/theme/monokai');
        this.testCodeForm.code.setMode('ace/mode/javascript');

        this.onCodeChange = EventBus.subscribe(events.onCodeChange, () => {

                this.testCodeForm.code.setValue(Game.codeExample);
        });

        if (Game.codeExample) {

            EventBus.publish(events.onCodeChange);
        }

        this.onBotCodeChange = EventBus.subscribe(events.onBotCodeChange, () => {

            this.testCodeButton = new Button(this.parent.el.querySelector('#testCode'), () => {
                event.preventDefault();

                const code = this.testCodeForm.code.getValue();

                this.pingPong.init(runCode(code, Game.botCode));
            });
            this.testCodeButton.onClick();
        });

        if (Game.botCode) {
            EventBus.publish(events.onBotCodeChange);
        }

        this.pingPong = new PingPong(this.parent.el.querySelector('.play__item__content_theme_screen'));

        const consoleContent = new ScrollableBlock(this.parent.el.querySelector('.play__item__content_theme_console'));
        consoleContent.decorate();

        this.testCodeForm.onSubmit((event) => {
            event.preventDefault();

            const code = this.testCodeForm.code.getValue();

            if (this.testCodeForm.validate()) {

                BotsService.sendBots(Game.slug, code);
                // this.pingPong.init(runCode(code));
            }
        });
    }

    public clear(): void {
        this.parent.el.innerHTML = '';
        this.onRulesChange.unsubscribe();
        this.onCodeChange.unsubscribe();
        this.onBotCodeChange.unsubscribe();

        this.testCodeForm = null;
        this.testCodeButton = null;
        this.pingPong = null;

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
            this.leftPanel.el.style.width =
                e.pageX -
                (this.leftPanel.el.offsetLeft +
                    shiftX) +
                this.verticalLine.el.offsetWidth / 2 +
                'px';
        };
    };
}

export default GamePage;