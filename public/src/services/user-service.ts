'use strict';

import Http from '../modules/http';
import User from '../models/user';
import EventBus from '../modules/event-bus';
import {events} from '../modules/utils/events';
import {userPaths} from './utils/paths';

class UserService {

    static signup(username: string, password: string): Promise<any> {

        const user = {username, password};

        return Http.Post(userPaths.signupPath, user)
            .then(resp => {

                User.active = true;
                EventBus.publish(events.authorized, '');
                return resp;
            });
    }


    static auth(username: string, password: string): Promise<any> {

        const user = {username, password};

        return Http.Post(userPaths.loginPath, user)
            .then(resp => {

                User.active = true;
                EventBus.publish(events.authorized, '');
                return resp;
            });
    }


    static isTaken(username: string): Promise<any> {

        return Http.Post(userPaths.takenPath, {username});
    }


    static signout(): Promise<any> {

        return Http.Delete(userPaths.logoutPath)
            .then(resp => {
                User.clearData();
                EventBus.publish(events.unauthorized, '');
                return resp;
            });
    }


    static edit(user: {[key: string]: string}): Promise<any> {

        return Http.Put(userPaths.editPath, user);
    }


    static me(): Promise<any> {

        return Http.Get(userPaths.mePath)
            .then(resp => {

                User.username = resp.username;
                User.avatar = resp.photo_uuid;
                return resp;
            });
    }
}

export default UserService;