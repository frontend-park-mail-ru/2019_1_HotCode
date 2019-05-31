'use strict';

import Router from '../modules/router';
import EventBus from '../modules/event-bus';
import User from "../models/user";
import AnotherUser from "../models/anotherUser";
import {viewPaths, viewRegs} from './utils/paths';
import {events} from '../modules/utils/events';

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

        if (path.match(viewRegs.profileViewPath)) {

            ViewService.goToProfileView(path.match(viewRegs.profileViewPath)[1]);
            return;
        }

        if (path.match(viewRegs.userMatchesViewPath)) {

            ViewService.goToUserMatchesView(path.match(viewRegs.userMatchesViewPath)[1]);
            return;
        }

        if (path.match(viewRegs.userBotsViewPath)) {

            ViewService.goToUserBotsView(path.match(viewRegs.userBotsViewPath)[1]);
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

        if (path.match(viewRegs.matchesViewPath)) {

            ViewService.goToGameMatchesView(path.match(viewRegs.matchesViewPath)[1]);
            return;
        }

        if (path.match(viewRegs.matchViewPath)) {

            ViewService.goToGameMatchView(
                path.match(viewRegs.matchViewPath)[1],
                path.match(viewRegs.matchViewPath)[2],
            );
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

    public static goToProfileView(id: string = 'me'): void {
        Router.go(viewPaths.profileViewPath.replace('ID', id), false, [id]);
    }

    public static goToUserBotsView(id: string = 'me'): void {
        Router.go(viewPaths.userBotsViewPath.replace('ID', id), false, [id]);
    }

    public static goToUserMatchesView(id: string = 'me'): void {
        Router.go(viewPaths.userMatchesViewPath.replace('ID', id), false, [id]);
    }

    public static goToGameDescriptionView(slug: string): void {
        Router.go(viewPaths.descriptionViewPath.replace('SLUG', slug), false, [slug]);
    }

    public static goToGameLiderBoardView(slug: string): void {
        Router.go(viewPaths.liderboardViewPath.replace('SLUG', slug), false, [slug]);
    }

    public static goToGameMatchesView(slug: string): void {
        Router.go(viewPaths.matchesViewPath.replace('SLUG', slug), false, [slug]);
    }

    public static goToGameMatchView(slug: string, id: string): void {
        Router.go(
            viewPaths.matchViewPath.replace('SLUG', slug).replace('ID', id),
            false,
            [
                slug,
                id,
            ],
        );
    }

    public static goToGameView(slug: string): void {
        Router.go(viewPaths.gameViewPath.replace('SLUG', slug), false, [slug]);
    }

    public static goToNotFoundView(): void {
        console.log('Not Found :(');
    }
}

export default ViewService;