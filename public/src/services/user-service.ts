'use strict';

import {events} from '../modules/utils/events';
import EventBus from '../modules/event-bus';
import Http from '../modules/http';
import {userPaths} from './utils/paths';
import User from '../models/user';

class UserService {

    public static signup(username: string, password: string): Promise<any> {

        const user = {username, password};

        return Http.Post(userPaths.signupPath, user)
            .then((resp) => {

                User.active = true;
                EventBus.publish(events.authorized, '');
                return resp;
            });
    }


    public static auth(username: string, password: string): Promise<any> {

        const user = {username, password};

        return Http.Post(userPaths.loginPath, user)
            .then((resp) => {

                User.active = true;
                EventBus.publish(events.authorized, '');
                return resp;
            });
    }


    public static isTaken(username: string): Promise<any> {

        return Http.Post(userPaths.takenPath, {username});
    }


    public static signout(): Promise<any> {

        return Http.Delete(userPaths.logoutPath)
            .then((resp) => {
                User.clearData();
                EventBus.publish(events.unauthorized, '');
                return resp;
            });
    }


    public static edit(user: {[key: string]: string}): Promise<any> {

        return Http.Put(userPaths.editPath, user);
    }


    public static me(): Promise<any> {

        return Http.Get(userPaths.mePath)
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