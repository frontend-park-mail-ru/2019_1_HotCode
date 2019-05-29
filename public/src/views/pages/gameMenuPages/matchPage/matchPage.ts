'use strict';

import Component from "../../../../components/baseComponent/index";
import Page from '../../page';
import Match from "../../../../models/match";
import EventBus from '../../../../modules/event-bus';
import {events} from '../../../../modules/utils/events';
import Panel from '../../../../components/panel/panel';
import {onDragAndDrop} from '../../../../modules/dragAndDrop';
import TestCodeForm from '../../../../components/form/testCodeForm';
import {runCode} from '../../../../modules/game/game';
import Button from '../../../../components/button/button';
import ScrollableBlock from '../../../../components/scrollable/scrollable';
import PingPong from '../../../../components/games/ping-pong/ping-pong';
import BotsService from '../../../../services/bots-service';
import Game from '../../../../models/game';
import AvatarService from '../../../../services/avatar-service';
import ViewService from '../../../../services/view-service';


class MatchPage extends Page{

    private static template = require('./matchPage.pug');

    private gamePanels: Panel[];
    private leftPanel: Component;
    private verticalLine: Component;
    private testCodeButton: Button;
    private testCodeButtonComponent: Component;
    private pingPong: PingPong;
    private testCodeForm: TestCodeForm;

    private onMatchLoad: {[key: string]: () => void};

    constructor(parent: Component) {
        super(parent, 'Match - Game - WarScript');
    }

    public render(param: string[]): void {

        super.render();
        this.renderTmpl(MatchPage.template);

        EventBus.publish(events.onHideMenu);

        BotsService.getMatch(param[1]);

        this.onMatchLoad = EventBus.subscribe(events.onMatchLoad, () => {

            this.renderMatchInfo();
        });

        if (Match.id) {

            EventBus.publish(events.onMatchLoad);
        }

        const rightPanel = new ScrollableBlock(this.parent.el.querySelector('.game__container-item'));
        rightPanel.decorate();

        this.gamePanels = Array.from(this.parent.el.querySelectorAll('.play__item'))
            .map((panel) => new Panel(panel as HTMLElement));

        this.leftPanel = new Component(this.parent.el.querySelector('.game__container-item_theme_left'));
        this.verticalLine = new Component(this.leftPanel.el.querySelector('.play__item__vetical-line__outline'));

        onDragAndDrop(this.verticalLine, this.onMove);

        this.testCodeForm = new TestCodeForm(this.parent.el.querySelector('.form_theme_editor'));

        this.testCodeForm.code.setTheme('ace/theme/monokai');
        this.testCodeForm.code.setMode('ace/mode/javascript');
        new Component(this.parent.el.querySelector('.ace_editor')).el.style.fontSize = '1em';

        const consoleContent = new ScrollableBlock(this.parent.el.querySelector('.play__item__content_theme_console'));
        consoleContent.decorate();
    }

    public clear(): void {
        this.parent.el.innerHTML = '';
        this.onMatchLoad.unsubscribe();
        Match.clearData();

        this.testCodeButtonComponent = null;
        this.gamePanels = null;
        this.leftPanel = null;
        this.verticalLine = null;
        this.testCodeButton = null;
        this.testCodeButtonComponent = null;
        this.pingPong = null;
        this.testCodeForm = null;
    }

    private renderMatchInfo() {

        const user1 = new Component(this.parent.el.querySelector('.match-info__user_theme_1'));

        const username1 =
            new Component(this.parent.el.querySelector('.match-info__user_theme_1 > .match-info__user__username'));
        const avatar1 =
            new Component(this.parent.el.querySelector('.match-info__user_theme_1 > .match-info__user__avatar'));
        const result1 =
            new Component(this.parent.el.querySelector('.match-info__user_theme_1 > .match-info__user__result'));
        const diff1 =
            new Component(this.parent.el.querySelector('.match-info__user_theme_1 > .match-info__user__score'));


        const user2 = new Component(this.parent.el.querySelector('.match-info__user_theme_2'));

        const username2 =
            new Component(this.parent.el.querySelector('.match-info__user_theme_2 > .match-info__user__username'));
        const avatar2 =
            new Component(this.parent.el.querySelector('.match-info__user_theme_2 > .match-info__user__avatar'));
        const result2 =
            new Component(this.parent.el.querySelector('.match-info__user_theme_2 > .match-info__user__result'));
        const diff2 =
            new Component(this.parent.el.querySelector('.match-info__user_theme_2 > .match-info__user__score'));


        const drawPanel = new Component(this.parent.el.querySelector('.match-info__draw'));
        const matchID = new Component(this.parent.el.querySelector('.match-info__id'));
        const date = new Component(this.parent.el.querySelector('.match-info__date'));


        username1.setText(Match.user1 ? Match.user1.username : '');

        if (Match.user1 && Match.user1.photo_uuid) {
            AvatarService.getAvatar(Match.user1.photo_uuid)
                .then((img) => {
                    (avatar1.el as HTMLImageElement).src = URL.createObjectURL(img);
                    avatar1.show();
                });
        }

        if (Match.user1 && Match.user1.id) {

            username1.addClass('pointer');
            username1.addClass('link');

            username1.on('click', (e) => {

                e.preventDefault();
                e.stopPropagation();
                ViewService.goToUserBotsView(`id${Match.user1.id}`);
            });

            avatar1.addClass('pointer');

            avatar1.on('click', (e) => {

                e.preventDefault();
                e.stopPropagation();
                ViewService.goToUserBotsView(`id${Match.user1.id}`);
            });
        }

        diff1.setText(Match.diff1 < 0 ? `- ${Math.abs(Match.diff1)}` : `+ ${Match.diff1}`);

        username2.setText(Match.user2 ? Match.user2.username : 'Verification');

        if (Match.user2 && Match.user2.photo_uuid) {
            AvatarService.getAvatar(Match.user2.photo_uuid)
                .then((img) => {
                    (avatar2.el as HTMLImageElement).src = URL.createObjectURL(img);
                    avatar2.show();
                });
        }

        if (Match.user2 && Match.user2.id) {

            username2.addClass('pointer');
            username2.addClass('link');

            username2.on('click', (e) => {

                e.preventDefault();
                e.stopPropagation();
                ViewService.goToUserBotsView(`id${Match.user2.id}`);
            });

            avatar2.addClass('pointer');

            avatar2.on('click', (e) => {

                e.preventDefault();
                e.stopPropagation();
                ViewService.goToUserBotsView(`id${Match.user2.id}`);
            });
        }

        diff2.setText(Match.diff2 < 0 ? `- ${Math.abs(Match.diff2)}` : `+ ${Match.diff2}`);


        if (Match.result === 0) {

            drawPanel.show();

        } else if (Match.result === 1) {

            user1.addClass('match-info__user_theme_win');
            result1.setText('Winner');
            user2.addClass('match-info__user_theme_loss');
            result2.setText('Loser');

        } else if (Match.result === 2) {

            matchID.addClass('match-info__id_theme_left');

            user1.addClass('match-info__user_theme_loss');
            result1.setText('Loser');
            user2.addClass('match-info__user_theme_win');
            result2.setText('Winner');

            date.addClass('match-info__date_theme_right');
        }

        matchID.setText(`Match #${Match.id}`);
        date.setText(Match.date);

        this.pingPong = new PingPong(this.parent.el.querySelector('.play__item__content_theme_screen'));

        this.testCodeForm.code.setValue(Match.code);

        this.testCodeButtonComponent = new Component(this.parent.el.querySelector('.button_theme_replay'));
        this.testCodeButtonComponent.show();

        this.testCodeButton = new Button(this.parent.el.querySelector('#testCode'), () => {
            event.preventDefault();

            this.pingPong.init(Match.replay);
        });
        this.testCodeButton.onClick();

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

export default MatchPage;