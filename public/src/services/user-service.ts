'use strict';

import {events} from '../modules/utils/events';
import EventBus from '../modules/event-bus';
import Http from '../modules/http';
import {userPaths} from './utils/paths';
import User from '../models/user';
import AnotherUser from '../models/anotherUser';
import serverNames from '../modules/utils/serverNames';

class UserService {

    private static server: string = serverNames.authBackend;

    public static signup(username: string, password: string): Promise<any> {

        const user = {username, password};

        return Http.Post(UserService.server + userPaths.signupPath, user)
    }


    public static auth(username: string, password: string): Promise<any> {

        const user = {username, password};

        return Http.Post(UserService.server + userPaths.loginPath, user)
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

    public static getUser(id: string): Promise<any> {

        return Http.Get(`${UserService.server}${userPaths.getUserPath}/${id}`)
            .then((resp) => {

                if (AnotherUser.id !== resp.id) {
                    AnotherUser.id = resp.id
                }

                if (AnotherUser.username !== resp.username) {
                    AnotherUser.username = resp.username;
                }

                if (AnotherUser.avatar !== resp.photo_uuid) {
                    AnotherUser.avatar = resp.photo_uuid;
                }

                return resp;
            });
    }

    public static me(isProfile = 0): Promise<any> {

        return Http.Get(UserService.server + userPaths.mePath)
            .then((resp) => {


                if (!isProfile) {

                    if (User.id !== resp.id) {
                        User.id = resp.id
                    }

                    if (User.username !== resp.username) {
                        User.username = resp.username;
                    }

                    if (User.avatar !== resp.photo_uuid) {
                        User.avatar = resp.photo_uuid;
                    }

                    if (User.key !== resp.vk_secret) {
                        User.key = resp.vk_secret;
                    }

                    EventBus.publish(events.onUserIDRender);
                    EventBus.publish(events.onUsernameRender);
                    EventBus.publish(events.onAvatarRender);

                } else if (isProfile === 1) {

                    EventBus.publish(events.onUserIDRender);
                    EventBus.publish(events.onUsernameRender);
                    EventBus.publish(events.onAvatarRender);

                } else {

                    if (User.id !== resp.id) {
                        User.id = resp.id
                    }

                    if (User.username !== resp.username) {
                        User.username = resp.username;
                    }

                    if (User.avatar !== resp.photo_uuid) {
                        User.avatar = resp.photo_uuid;
                    }

                    if (User.key !== resp.vk_secret) {
                        User.key = resp.vk_secret;
                    }
                }

                return resp;
            });
    }
}

export default UserService;