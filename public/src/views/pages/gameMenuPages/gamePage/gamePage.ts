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
import Alert from '../../../../components/alert/alert';
import Message from '../../../../utils/message';

class GamePage extends Page{

    private static template = require('./gamePage.pug');

    private gamePanels: Panel[];
    private leftPanel: Component;
    private verticalLine: Component;
    private testCodeForm: TestCodeForm;
    private testCodeButton: Button;
    private pingPong: PingPong;
    private rulesContent: Component;
    private choiseButton: Component;

    private onRulesChange: {[key: string]: () => void};
    private onCodeChange: {[key: string]: () => void};
    private onBotCodeChange: {[key: string]: () => void};

    constructor(parent: Component) {
        super(parent, 'Game - WarScript');
    }

    public render(): void {
        super.render();
        this.renderTmpl(GamePage.template);

        this.choiseButton = new Component(document.querySelector('.menu__item__option_theme_game'));

        EventBus.subscribe(events.onSlug2Change, () => {
            EventBus.publish(events.onOpenGame, true);
        });

        this.choiseButton.active();

        EventBus.publish(events.onHideMenu);

        const rightPanel = new ScrollableBlock(this.parent.el.querySelector('.game__container-item'));
        rightPanel.decorate();

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
        new Component(this.parent.el.querySelector('.ace_editor')).el.style.fontSize = '1em';

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

        const submitButton = new Component(this.parent.el.querySelector('.button_theme_submit'));

        this.testCodeForm.onSubmit((event) => {
            event.preventDefault();

            const code = this.testCodeForm.code.getValue();

            if (this.testCodeForm.validate()) {

                (submitButton.el as HTMLInputElement).disabled = true;
                submitButton.addClass('button_theme_disable-submit');
                BotsService.sendBots(Game.slug, code)
                    .then(() => {
                        Alert.alert(Message.successfulSendBot());
                        return;
                    })
                    .catch(() => {
                        EventBus.publish(events.openSignIn, '');
                        Alert.alert(Message.accessError(), true);
                        return;
                    })
                    .finally(() => {
                        (submitButton.el as HTMLInputElement).disabled = false;
                        submitButton.removeClass('button_theme_disable-submit');
                    });
            }
        });
    }

    public clear(): void {
        this.parent.el.innerHTML = '';

        this.choiseButton.disactive();

        this.onRulesChange.unsubscribe();
        this.onCodeChange.unsubscribe();
        this.onBotCodeChange.unsubscribe();

        this.testCodeForm = null;
        this.testCodeButton = null;
        this.pingPong = null;
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