'use strict';

import Http from '../modules/http';
import Paths from '../modules/pathConfig';
import User from "../models/user";
import EventBus from "../modules/event-bus";

class UserService {
    static signup(username, password, callback) {
        const user = {username, password};
        Http.Post(Paths.paths.signupPath, user, (err, userdata) => {
            if (err) {
                return callback(err, userdata);
            }

            User.active = true;
            EventBus.publish('authorized', '');
            callback(null, userdata);
        });
    }

    static auth(username, password, callback) {
        const user = {username, password};
        Http.Post(Paths.paths.signinPath, user, (err, userdata) => {
            if (err) {
                return callback(err, userdata);
            }

            User.active = true;
            EventBus.publish('authorized', '');
            callback(null, userdata);
        });
    }

    static isTaken(username, callback) {
        Http.Post(Paths.paths.takenPath, {username}, callback);
    }

    static signout(callback) {
        Http.Delete(Paths.paths.signoutPath, (err, resp) => {
            if (err) {
                return callback(err, resp);
            }

            User.clearData();
            EventBus.publish('unauthorized', '');
            callback(null, resp);

        });
    }

    static edit(username, oldPassword, newPassword, photo_uuid, callback) {
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
            Http.Put(Paths.paths.editPath, user, callback);
        }
    }

    static me(callback, forse = false) {
        if (User.username && !forse) {
            return callback(null, User);
        }
        Http.Get(Paths.paths.mePath, (err, userdata) => {
            if (err) {
                return callback(err, userdata);
            }

            User.username = userdata.username;
            User.avatar = userdata.photo_uuid;
            callback(null, userdata);
        });
    }
}

export default UserService;