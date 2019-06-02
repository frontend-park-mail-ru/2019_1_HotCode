'use strict';

import Component from '../../../components/baseComponent/index';
import Button from "../../../components/button/button";
import Checkbox from "../../../components/checkbox/checkbox";
import Layer from '../layer';
import ViewService from '../../../services/view-service';
import Tabbar from '../../../components/tabbar/tabbar';
import Alert from '../../../components/alert/alert';
import Message from '../../../utils/message';
import {events} from '../../../modules/utils/events';
import UserService from '../../../services/user-service';
import EventBus from '../../../modules/event-bus';
import ChatBlock from '../../../components/chatBlock/chatBlock';
import OptionsMenu from '../../../components/optionsMenu/optionsMenu';
import WebSock from '../../../modules/webSocket';
import User from '../../../models/user';
import NotifyService from '../../../services/notify-service';

class BaseLayer extends Layer{

    private static template = require('./baseLayer.pug');
    private static stopGenSquares: boolean;
    private static stopGenGlitches: boolean;

    private optionsMenu: OptionsMenu;
    private logoButton: Button;
    private menuMobile: Component;

    private ws: WebSock;

    private profileButton: Button;
    private signoutButton: Button;
    private chatButton: Checkbox;
    private modalWindows: Tabbar;
    private authorizationSection: Component;
    private footerSection: Component;
    private modalWindowContainer: Component;
    private containerOfRandomSquares: Component;
    private containerOfRandomGlitches: Component;
    private headerComponent: Component;

    constructor(parent: Component) {
        super(parent);

        BaseLayer.stopGenSquares = false;
    }

    public render(): void {
        this.renderTmplBesideHTML(BaseLayer.template);

        this.generateRandomEvents();
        this.generateSqures();

        this.containerOfRandomSquares = new Component(this.parent.el.querySelector('.random-elements_squares'));
        this.containerOfRandomGlitches = new Component(this.parent.el.querySelector('.random-elements'));

        EventBus.subscribe(events.onStopGenerateSqures, () => {

            this.containerOfRandomSquares.hide();
            BaseLayer.stopGenSquares = true;
        });
        EventBus.subscribe(events.onContinueGenerateSqures, () => {

            this.containerOfRandomSquares.show();
            BaseLayer.stopGenSquares = false;
            this.generateSqures();
        });
        EventBus.subscribe(events.onStopGenerateGlitches, () => {

            this.containerOfRandomGlitches.hide();
            BaseLayer.stopGenGlitches = true;
        });
        EventBus.subscribe(events.onContinueGenerateGlitches, () => {

            this.containerOfRandomGlitches.show();
            BaseLayer.stopGenGlitches = false;
            this.generateRandomEvents();
        });

        this.menuMobile = new Component(this.parent.el.querySelector('.nav-content'));

        this.optionsMenu = new OptionsMenu(this.parent.el.querySelector('.options'));

        this.logoButton = new Button(this.parent.el.querySelector('#logo'), () => {
            ViewService.goToMainView();
        });

        this.profileButton = new Button(this.parent.el.querySelector('#profile'), () => {
                ViewService.goToProfileView();
        });

        this.headerComponent = new Component(this.parent.el.querySelector('.header'));

        this.signoutButton = new Button(this.parent.el.querySelector('#signout'), () => {
            UserService.signout()
                .catch((e) => {
                    if (e.code === 401) {

                        EventBus.publish(events.openSignIn, '');
                        Alert.alert(Message.accessError(), true);
                    }
                });
        });


        const chat = new ChatBlock();
        this.chatButton = new Checkbox(this.parent.el.querySelector('#chat'),
            () => {
                chat.render();
            },
            () => {
                chat.clear();
            },
        );

        this.modalWindows = new Tabbar(this.parent.el.querySelector('.modal__windows'), {
            mod0: () => {
                ViewService.goBack(2);
            },
            mod1: () => {
                ViewService.goToLoginView();
            },
            mod2: () => {
                ViewService.goToSignupView();
            },
        });

        this.authorizationSection = new Component(this.parent.el.querySelector('.footer__container-item'));

        this.footerSection = new Component(this.parent.el.querySelector('.footer'));

        this.modalWindowContainer = new Component(this.parent.el.querySelector('.modal__window'));

        this.on();

        EventBus.subscribe(events.onChangeSlug2, (newSlug) => {
            console.log('change2 ', newSlug);
        });

        UserService.me(2)
            .then(() => {
                EventBus.publish(events.authorized, '');
            })
            .catch(() => {
                EventBus.publish(events.unauthorized, '');
            });

        this.adv();
    }

    public clear() {
        this.menuMobile.clear();
        this.menuMobile = null;

        this.logoButton.clearAllReferences();
        this.logoButton.clear();
        this.logoButton = null;

        this.profileButton.clearAllReferences();
        this.profileButton.clear();
        this.profileButton = null;

        this.modalWindows.clear();
        this.modalWindows = null;

        this.modalWindowContainer.clear();
        this.modalWindowContainer = null;

        this.footerSection.clear();
        this.footerSection = null;

        this.optionsMenu.clear();
        this.optionsMenu = null;

        this.containerOfRandomSquares.clear();
        this.containerOfRandomSquares = null;

        if (this.ws) {
            this.ws.close();
        }
        this.ws = null;
    }

    private on(): void {

        this.logoButton.onClick();
        this.profileButton.onClick();
        this.signoutButton.onClick();
        this.chatButton.onChange();
        this.modalWindows.onChange();

        EventBus.subscribe(events.authorized, () => {
            this.headerComponent.setTextAnim(`{${User.username}}`);

            this.authorizationSection.hide();
            this.modalWindows.tabs.map((tab) => {
                tab.hideAllReferences();
            });
            this.profileButton.showAllReferences();
            this.signoutButton.showAllReferences();

            if (this.ws) {
                this.ws.close();
            }
            this.ws = null;

            this.getNotify();
        });

        EventBus.subscribe(events.unauthorized, () => {
            this.profileButton.hideAllReferences();
            this.signoutButton.hideAllReferences();
            this.modalWindows.tabs.map((tab) => {
                tab.showAllReferences();
            });
            this.authorizationSection.show();

            this.headerComponent.clear();
        });
    }

    private getNotify = () => {

        this.ws = NotifyService.getNotify();
        this.ws.open(
            () => {},
            (resp) => {
                if (resp.type === 'match') {

                    if (resp.body.diff > 0) {

                        Alert.notify(
                            'Great job! ' +
                            `In the new battle, your bot # ${resp.body.bot_id} scored ${resp.body.diff} points. ` +
                            'It\'s time to watch the ',
                            'replay',
                            () => {

                                ViewService.goToGameMatchView(
                                    resp.body.game_slug,
                                    resp.body.match_id,
                                );
                            }
                        )

                    } else {

                        Alert.notify(
                            'At another time, be sure to succeed! ' +
                            `In the new battle, your bot # ${resp.body.bot_id} scored ${resp.body.diff} points. ` +
                            'It\'s time to watch the ',
                            'replay',
                            () => {

                                ViewService.goToGameMatchView(
                                    resp.body.game_slug,
                                    resp.body.match_id,
                                );
                            }
                        )
                    }
                }

                if (resp.type === 'verify') {

                    if (resp.body.veryfied) {

                        Alert.notify(
                            'Great start, more interesting!\n' +
                            `Your bot # ${resp.body.bot_id} was tested.\n` +
                            'It\'s time to watch the ',
                            'replay',
                            () => {

                                ViewService.goToGameMatchView(
                                    resp.body.game_slug,
                                    resp.body.match_id,
                                );
                            }
                        )

                    } else {

                        Alert.notify(
                            `Your bot # ${resp.body.bot_id} did not pass testing. ` +
                            'It\'s time to watch the ',
                            'replay',
                            () => {

                                ViewService.goToGameMatchView(
                                    resp.body.game_slug,
                                    resp.body.match_id,
                                );
                            }
                        )
                    }
                }

                if (resp.type === 'alert') {
                    Alert.alert(resp.body.message, true, 10);
                }

                if (resp.type === 'info') {
                    Alert.alert(resp.body.message, false, 10);
                }
            },
            () => {},
        );
    };

    private generateSqures(): void {

        const randomElements = new Component(this.parent.el.querySelector('.random-elements_squares'));

        let minWidth = 3;
        let maxWidth = 6;
        let minRight = 0;
        let maxRight = 100;
        let minTop = 0;
        let maxTop = 100 - maxWidth * 2;
        let minDuration = 33000;
        let maxDuration = 14000;
        let minZIndex = -140;
        let maxZIndex = -15;

        for (let i = 0; i < 20; i++) {

            const square = Component.Create('div', ['fly-square']);

            const right = Math.random() * (maxRight - minRight) + minRight;
            const top = Math.random() * (maxTop - minTop) + minTop;
            const width = Math.random() * (maxWidth - minWidth) + minWidth;
            const duration =
                (((width - minWidth) * 100 / (maxWidth - minWidth)) *
                    (maxDuration - minDuration) / 100 + minDuration) *
                (right + 50) / 150;
            const zIndex =
                ((width - minWidth) * 100 / (maxWidth - minWidth)) *
                (maxZIndex - minZIndex) / 100 + minZIndex;

            square.el.style.right = right + '%';
            square.el.style.top = top + 'vh';
            square.el.style.width = width + 'vw';
            square.el.style.zIndex = Math.floor(zIndex).toString();

            randomElements.el.appendChild(square.el);

            const animation = square.el.animate(
                [
                    {
                        right: right + '%',
                    },
                    {
                        right: '-50%',
                    },
                ],
                {
                    duration: duration,
                });
            animation.addEventListener('finish', () => {

                square.el.parentNode.removeChild(square.el);
            });
        }


        let minTime = 500;
        let maxTime = 1000;

        let timeoutSquare = Math.random() * (maxTime - minTime) + minTime;

        const move = [
            {
                right: '100%'
            },
            {
                right: '-50%'
            }
        ];

        let timerId = setTimeout(function generateSquare() {
            const square = Component.Create('div', ['fly-square']);

            const top = Math.random() * (maxTop - minTop) + minTop;
            const width = Math.random() * (maxWidth - minWidth) + minWidth;
            const duration =
                ((width - minWidth) * 100 / (maxWidth - minWidth)) *
                (maxDuration - minDuration) / 100 + minDuration;
            const zIndex =
                ((width - minWidth) * 100 / (maxWidth - minWidth)) *
                (maxZIndex - minZIndex) / 100 + minZIndex;

            timeoutSquare = Math.random() * (maxTime - minTime) + minTime;

            square.el.style.right = 100 + '%';
            square.el.style.top = top + 'vh';
            square.el.style.width = width + 'vw';
            square.el.style.zIndex = Math.floor(zIndex).toString();

            randomElements.el.appendChild(square.el);

            const animation = square.el.animate(move, {
                duration: duration,
            });
            animation.addEventListener('finish', () => {

                square.el.parentNode.removeChild(square.el);
            });

            if (!BaseLayer.stopGenSquares) {

                timerId = setTimeout(generateSquare, timeoutSquare);
            }
        }, timeoutSquare);
    }

    private generateRandomEvents(): void {

        const randomElements = new Component(this.parent.el.querySelector('.random-elements'));

        let minLeft = 5;
        let maxLeft = 95;
        let minTop = 5;
        let maxTop = 95;

        let minTime2 = 1000;
        let maxTime2 = 2000;


        let timeout = Math.random() * (maxTime2 - minTime2) + minTime2;

        let timerPixel = setTimeout(function generatePixels() {
            const point = Component.Create('div', ['point']);

            const left = Math.random() * (maxLeft - minLeft) + minLeft;
            const top = Math.random() * (maxTop - minTop) + minTop;
            let timeoutOnDelete = Math.random() * (10000 - 6000) + 6000;
            timeout = Math.random() * (maxTime2 - minTime2) + minTime2;

            point.el.style.left = left + 'vw';
            point.el.style.top = top + 'vh';


            let redPoint = Component.Create('div', ['red-point']);

            redPoint.el.style.left = Math.random() * 4 + 'px';
            redPoint.el.style.top = Math.random() * 4 + 'px';

            point.el.appendChild(redPoint.el);

            let bluePoint = Component.Create('div', ['blue-point']);

            bluePoint.el.style.left = Math.random() * 4 + 'px';
            bluePoint.el.style.top = Math.random() * 4 + 'px';

            point.el.appendChild(bluePoint.el);

            let greenPoint = Component.Create('div', ['green-point']);

            greenPoint.el.style.left = Math.random() * 4 + 'px';
            greenPoint.el.style.top = Math.random() * 4 + 'px';

            point.el.appendChild(greenPoint.el);

            randomElements.el.appendChild(point.el);

            setTimeout(() => {
                point.el.parentNode.removeChild(point.el);
            }, timeoutOnDelete);

            if (!BaseLayer.stopGenGlitches) {
                timerPixel = setTimeout(generatePixels, timeout);
            }
        }, timeout);


        let minTime3 = 8000;
        let maxTime3 = 10000;

        let timeout2 = Math.random() * (maxTime3 - minTime3) + minTime3;

        let line = new Component(this.parent.el.querySelector('.bug-line'));
        if (!line.el) {

            line = Component.Create('div', ['bug-line']);
            randomElements.el.appendChild(line.el);
        }
        line.el.style.display = 'none';

        let timerLine = setTimeout(function spawnLine() {

            const left = Math.random() * (maxLeft - minLeft) + minLeft;
            let timeoutOnDelete = Math.random() * (3500 - 2500) + 2500;
            timeout2 = Math.random() * (maxTime3 - minTime3) + minTime3;

            line.el.style.left = left + 'vw';


            line.el.style.display = 'block';

            setTimeout(() => {
                line.el.style.display = 'none';
            }, timeoutOnDelete);

            if(!BaseLayer.stopGenGlitches) {
                timerLine = setTimeout(spawnLine, timeout2);
            }
        }, timeout2);
    }

    private adv(): void {
        console.log('Привет! Мы ищем увлечённых мотивированных разработчиков и поэтому приглашаем тебя к себе.\n' +
            '\n' +
            'Сайт — это лишь вершина информационной системы, которую мы создаём для достижения своей цели. Наша цель — построения самой функциональной системы по тестированию ботов на планете.\n' +
            '\n' +
            'Сегодня у нас более 450 анимашек в 12 страницах, и мы обрабатываем 160000000 запросов в секунду. Через 2 года у нас будет 800 анимашек и 3B запросов в секунду. Чтобы успевать за темпами роста бизнеса, мы совершенствуем стек технологий: заменяем Go + Native JS на Scala + Vue.js, переходим от монолитной архитектуры к сервисной, автоматизируем деплой и регрессионное тестирование. Хостим всё в Mail.ru.\n' +
            '\n' +
            'Мы предлагаем зарплату (печеньем и вниманием), опционы и возможность принять участие в построении международного бизнеса. За последние четыре года по собственной инициативе от нас уволилось три разработчика. Чтобы понять, подходим ли мы друг другу, просто приходи в гости — посмотришь офис, окунёшься в атмосферу. Пиши в варсцрипт.рф в чат');
    }
}

export default BaseLayer;