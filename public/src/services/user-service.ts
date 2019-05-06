'use strict';

import {events} from '../modules/utils/events';
import EventBus from '../modules/event-bus';
import Http from '../modules/http';
import {userPaths} from './utils/paths';
import User from '../models/user';
import serverNames from '../modules/utils/serverNames';

class UserService {

    private static server: string = serverNames.authBackend;

    public static signup(username: string, password: string): Promise<any> {

        const user = {username, password};

        return Http.Post(UserService.server + userPaths.signupPath, user)
            .then((resp) => {

                User.active = true;
                EventBus.publish(events.authorized, '');
                return resp;
            });
    }


    public static auth(username: string, password: string): Promise<any> {

        const user = {username, password};

        return Http.Post(UserService.server + userPaths.loginPath, user)
            .then((resp) => {

                User.active = true;
                EventBus.publish(events.authorized, '');
                return resp;
            });
    }


    public static isTaken(username: string): Promise<any> {

        return Http.Post(UserService.server + userPaths.takenPath, {username});
    }


    public static signout(): Promise<any> {

        return Http.Delete(UserService.server + userPaths.logoutPath)
            .then((resp) => {
                User.clearData();
                EventBus.publish(events.unauthorized, '');
                return resp;
            });
    }


    public static edit(user: {[key: string]: string}): Promise<any> {

        return Http.Put(UserService.server + userPaths.editPath, user);
    }


    public static me(): Promise<any> {

        return Http.Get(UserService.server + userPaths.mePath)
            .then((resp) => {

                if (User.username !== resp.username) {
                    User.username = resp.username;
                }

                if (User.avatar !== resp.photo_uuid) {
                    User.avatar = resp.photo_uuid;
                }
                return resp;
            });
    }
}

export default UserService;