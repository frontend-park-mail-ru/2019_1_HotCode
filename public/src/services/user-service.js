'use strict';

import Http from '../modules/http';
import Paths from '../modules/pathConfig';
import User from '../models/user';
import EventBus from '../modules/event-bus';

class UserService {
    static signup(username, password) {
        const user = {username, password};
        return Http.Post(Paths.paths.signupPath, user)
            .then(resp => {
                User.active = true;
                EventBus.publish('authorized', '');
                return resp;
            });
    }

    static auth(username, password) {
        const user = {username, password};
        return Http.Post(Paths.paths.signinPath, user)
            .then(resp => {
                User.active = true;
                EventBus.publish('authorized', '');
                return resp;
            });
    }

    static isTaken(username) {
        return Http.Post(Paths.paths.takenPath, {username});
    }

    static signout() {
        return Http.Delete(Paths.paths.signoutPath)
            .then(resp => {
                User.clearData();
                EventBus.publish('unauthorized', '');
                return resp;
            });
    }

    static edit(username, oldPassword, newPassword, photo_uuid) {
        let user = {};
        if (username) {
            user.username = username
        }
        if (newPassword || oldPassword) {
            user.oldPassword = oldPassword;
            user.newPassword = newPassword;
        }
        if (photo_uuid) {
            user.photo_uuid = photo_uuid;
        }
        if (user) {
            return Http.Put(Paths.paths.editPath, user);
        }
    }

    static me() {
        return Http.Get(Paths.paths.mePath)
            .then(resp => {
                User.username = resp.username;
                User.avatar = resp.photo_uuid;
                return resp;
            });
    }
}

export default UserService;