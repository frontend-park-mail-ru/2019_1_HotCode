'use strict';

import Router from '../modules/router';
import {viewPaths, viewRegs} from './utils/paths';

class ViewService {

    public static goTo(path: string): void {

        if (path.match(viewRegs.startViewPath)) {

            ViewService.goToStartView();
            return;
        }

        if (path.match(viewRegs.mainViewPath)) {

            ViewService.goToMainView();
            return;
        }

        if (path.match(viewRegs.loginViewPath)) {

            ViewService.goToLoginView();
            return;
        }

        if (path.match(viewRegs.signupViewPath)) {

            ViewService.goToSignupView();
            return;
        }

        if (path.match(viewRegs.settingsViewPath)) {

            ViewService.goToSettingsView();
            return;
        }

        if (path.match(viewRegs.descriptionViewPath)) {

            ViewService.goToGameDescriptionView(path.match(viewRegs.descriptionViewPath)[1]);
            return;
        }

        if (path.match(viewRegs.liderboardViewPath)) {

            ViewService.goToGameLiderBoardView(path.match(viewRegs.liderboardViewPath)[1]);
            return;
        }

        if (path.match(viewRegs.gameViewPath)) {

            ViewService.goToGameView(path.match(viewRegs.gameViewPath)[1]);
            return;
        }

        ViewService.goToNotFoundView();

    }

    public static start(): void {
        Router.start();
    }

    public static goBack(deep: number) {
        Router.popStack(deep);
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

    public static goToGameDescriptionView(slug: string): void {
        Router.go(viewPaths.descriptionViewPath.replace('SLUG', slug), false, slug);
    }

    public static goToGameLiderBoardView(slug: string): void {
        Router.go(viewPaths.liderboardViewPath.replace('SLUG', slug), false, slug);
    }

    public static goToGameView(slug: string): void {
        Router.go(viewPaths.gameViewPath.replace('SLUG', slug), false, slug);
    }

    public static goToNotFoundView(): void {
        console.log('Not Found :(');
    }
}

export default ViewService;