'use strict';

import Router from '../modules/router';
import {viewPaths} from './utils/paths';
import ViewInfo from '../views/viewInfo';
import Component from '../components/baseComponent/index';
import BaseLayer from '../views/layers/baseView/baseLayer';
import MainPage from '../views/pages/mainView/mainPage';
import SettingsPage from '../views/pages/settingsView/settingsPage';
import GameMenuLayer from '../views/layers/gameMenuLayer/gameMenuLayer';
import SignupPage from '../views/pages/authorizationViews/signupView/signupPage';
import SigninPage from '../views/pages/authorizationViews/signinView/signinPage';
import LiderboardPage from '../views/pages/gameMenuView/liderboardView/liderboardPage';
import DescriptionPage from '../views/pages/gameMenuView/descriptionPage/descriptionPage';
import GamePage from '../views/pages/gameMenuView/gamePage/gamePage';

class ViewService {

    private static views = [
        new ViewInfo(
            'baseLayer',
            () => new BaseLayer(),
            'root',
            null,
            [
                'mainPage',
                'settingsPage',
                'gameMenuLayer',
                'signinPage',
                'signupPage',
            ]
        ),
        new ViewInfo(
            'mainPage',
            () => new MainPage(Component.getBy('div.container')),
            'mainContainer',
            viewPaths.mainViewPath
        ),
        new ViewInfo(
            'settingsPage',
            () => new SettingsPage(Component.getBy('div.container')),
            'mainContainer',
            viewPaths.settingsViewPath
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
            ]
        ),
        new ViewInfo(
            'signinPage',
            () => new SigninPage(Component.getBy('.modal__window')),
            'modalWindow',
            viewPaths.loginViewPath,
            null,
            'mainPage'
        ),
        new ViewInfo(
            'signupPage',
            () => new SignupPage(Component.getBy('.modal__window')),
            'modalWindow',
            viewPaths.signupViewPath,
            null,
            'mainPage'
        ),
        new ViewInfo(
            'descriptionPage',
            () => new DescriptionPage(Component.getBy('.game__content')),
            'gameContainer',
            viewPaths.descriptionViewPath
        ),
        new ViewInfo(
            'liderboardPage',
            () => new LiderboardPage(Component.getBy('.game__content')),
            'gameContainer',
            viewPaths.liderboardViewPath
        ),
        new ViewInfo(
            'gamePage',
            () => new GamePage(Component.getBy('.game__content')),
            'gameContainer',
            viewPaths.gameViewPath
        ),
    ];

    public static goTo(path: string): void {

        switch (path) {

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

}

export default ViewService;