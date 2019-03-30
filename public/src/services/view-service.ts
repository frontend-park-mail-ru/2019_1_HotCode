'use strict';

import Router from '../modules/router';
import {viewPaths} from './utils/paths';
import ViewInfo from '../views/viewInfo';
import Component from '../components/baseComponent/index';
import BaseLayer from '../views/layers/baseLayer/baseLayer';
import MainPage from '../views/pages/mainPage/mainPage';
import SettingsPage from '../views/pages/settingsPage/settingsPage';
import GameMenuLayer from '../views/layers/gameMenuLayer/gameMenuLayer';
import SignupPage from '../views/pages/authorizationPages/signupPage/signupPage';
import SigninPage from '../views/pages/authorizationPages/signinPage/signinPage';
import LiderboardPage from '../views/pages/gameMenuPages/liderboardPage/liderboardPage';
import DescriptionPage from '../views/pages/gameMenuPages/descriptionPage/descriptionPage';
import GamePage from '../views/pages/gameMenuPages/gamePage/gamePage';
import RootLayer from '../views/layers/rootLayer/rootLayer';
import OptionsLayer from '../views/layers/optionsLayer/optionsLayer';
import ContainerLayer from '../views/layers/containerLayer/containerLayer';
import PopUpLayer from '../views/layers/popUpLayer/popUpLayer';
import StartPage from '../views/pages/startPage/startPage';

class ViewService {

    public static goTo(path: string): void {

        switch (path) {

            case viewPaths.startViewPath: {
                ViewService.goToStartView();
                break;
            }

            case viewPaths.mainViewPath: {
                ViewService.goToMainView();
                break;
            }

            case viewPaths.loginViewPath: {
                ViewService.goToLoginView();
                break;
            }

            case viewPaths.signupViewPath: {
                ViewService.goToSignupView();
                break;
            }

            case viewPaths.settingsViewPath: {
                ViewService.goToSettingsView();
                break;
            }

            case viewPaths.descriptionViewPath: {
                ViewService.goToGameDescriptionView();
                break;
            }

            case viewPaths.liderboardViewPath: {
                ViewService.goToGameLiderBoardView();
                break;
            }

            case viewPaths.gameViewPath: {
                ViewService.goToGameView();
                break;
            }

            default: {
                ViewService.goToNotFoundView();
            }
        }
    }

    public static start(): void {
        Router.views = ViewService.views;
        Router.start();
    }

    public static goBack() {
        Router.popStack();
    }

    public static goToStartView(): void {
        Router.go(viewPaths.startViewPath);
    }

    public static goToMainView(): void {
        Router.go(viewPaths.mainViewPath);
    }

    public static goToLoginView(): void {
        Router.go(viewPaths.loginViewPath);
    }

    public static goToSignupView(): void {
        Router.go(viewPaths.signupViewPath);
    }

    public static goToSettingsView(): void {
        Router.go(viewPaths.settingsViewPath);
    }

    public static goToGameDescriptionView(): void {
        Router.go(viewPaths.descriptionViewPath);
    }

    public static goToGameLiderBoardView(): void {
        Router.go(viewPaths.liderboardViewPath);
    }

    public static goToGameView(): void {
        Router.go(viewPaths.gameViewPath);
    }

    public static goToNotFoundView(): void {
        console.log('Not Found :(');
    }

    private static views = [
        new ViewInfo(
            'rootLayer',
            () => new RootLayer(),
            'root',
            null,
            [
                'containerLayer',
            ],
        ),
        new ViewInfo(
            'containerLayer',
            () => new ContainerLayer(Component.getBy('.root')),
            'container',
            null,
            [
                'baseLayer',
            ],
        ),
        // new ViewInfo(
        //     'optionsLayer',
        //     () => new OptionsLayer(Component.getBy('.root')),
        //     'options',
        //     null,
        //     [
        //         'baseLayer'
        //     ]
        // ),
        new ViewInfo(
            'baseLayer',
            () => new BaseLayer(Component.getBy('.root')),
            'base',
            null,
            [
                'startPage',
                'mainPage',
                'settingsPage',
                'gameMenuLayer',
                'popUpLayer',
            ],
        ),
        new ViewInfo(
            'popUpLayer',
            () => new PopUpLayer(Component.getBy('.modal__window')),
            'popup',
            null,
            [
                'signinPage',
                'signupPage',
            ],
            'mainPage',
        ),
        new ViewInfo(
            'startPage',
            () => new StartPage(Component.getBy('div.container')),
            'mainContainer',
            viewPaths.startViewPath,
        ),
        new ViewInfo(
            'mainPage',
            () => new MainPage(Component.getBy('div.container')),
            'mainContainer',
            viewPaths.mainViewPath,
        ),
        new ViewInfo(
            'settingsPage',
            () => new SettingsPage(Component.getBy('div.container')),
            'mainContainer',
            viewPaths.settingsViewPath,
        ),
        new ViewInfo(
            'gameMenuLayer',
            () => new GameMenuLayer(Component.getBy('div.container')),
            'mainContainer',
            null,
            [
                'descriptionPage',
                'liderboardPage',
                'gamePage',
            ],
        ),
        new ViewInfo(
            'signinPage',
            () => new SigninPage(Component.getBy('.modal__info')),
            'modalWindow',
            viewPaths.loginViewPath,
        ),
        new ViewInfo(
            'signupPage',
            () => new SignupPage(Component.getBy('.modal__info')),
            'modalWindow',
            viewPaths.signupViewPath,
        ),
        new ViewInfo(
            'descriptionPage',
            () => new DescriptionPage(Component.getBy('.game__content')),
            'gameContainer',
            viewPaths.descriptionViewPath,
        ),
        new ViewInfo(
            'liderboardPage',
            () => new LiderboardPage(Component.getBy('.game__content')),
            'gameContainer',
            viewPaths.liderboardViewPath,
        ),
        new ViewInfo(
            'gamePage',
            () => new GamePage(Component.getBy('.game__content')),
            'gameContainer',
            viewPaths.gameViewPath,
        ),
    ];
}

export default ViewService;