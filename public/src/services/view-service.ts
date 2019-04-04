'use strict';

import Router from '../modules/router';
import {viewPaths} from './utils/paths';

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
}

export default ViewService;