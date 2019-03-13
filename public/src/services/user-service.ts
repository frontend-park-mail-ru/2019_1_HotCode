'use strict';

import Http from '../modules/http';
import Paths from '../utils/pathConfig';
import User from '../models/user';
import EventBus from '../modules/event-bus';
import {events} from '../utils/events';

class UserService {

    static signup(username: string, password: string): Promise<any> {

        const user = {username, password};

        return Http.Post(Paths.paths.signupPath, user)
            .then(resp => {

                User.active = true;
                EventBus.publish(events.authorized, '');
                return resp;
            });
    }


    static auth(username: string, password: string): Promise<any> {

        const user = {username, password};

        return Http.Post(Paths.paths.signinPath, user)
            .then(resp => {

                User.active = true;
                EventBus.publish(events.authorized, '');
                return resp;
            });
    }


    static isTaken(username: string): Promise<any> {

        return Http.Post(Paths.paths.takenPath, {username});
    }


    static signout(): Promise<any> {

        return Http.Delete(Paths.paths.signoutPath)
            .then(resp => {
                User.clearData();
                EventBus.publish(events.unauthorized, '');
                return resp;
            });
    }


    static edit(username: string,
                oldPassword: string,
                newPassword: string,
                photo_uuid: string): Promise<any>
    {

        let user: {[key: string]: string} = {};

        if (username) {
            user.username = username
        }

        if (oldPassword) {
            user.oldPassword = oldPassword;
            user.newPassword = newPassword;
        }

        if (photo_uuid) {
            user.photo_uuid = photo_uuid;
        }

        if (Object.keys(user).length != 0) {
            return Http.Put(Paths.paths.editPath, user);
        }
    }


    static me(): Promise<any> {

        return Http.Get(Paths.paths.mePath)
            .then(resp => {

                User.username = resp.username;
                User.avatar = resp.photo_uuid;
                return resp;
            });
    }
}

export default UserService;