'use strict';

import Http from '../modules/http';
import Paths from '../modules/pathConfig';
import User from "../models/user";
import EventBus from "../modules/event-bus";

class UserService {
    static signup(username, password, callback) {
        const user = {username, password};
        Http.Post(Paths.paths.signupPath, user)
            .then(resp => {
                User.active = true;
                EventBus.publish('authorized', '');
                callback(null, resp);
            })
            .catch(err => {
                callback(err, null);
            });
    }

    static auth(username, password, callback) {
        const user = {username, password};
        Http.Post(Paths.paths.signinPath, user)
            .then(resp => {
                User.active = true;
                EventBus.publish('authorized', '');
                callback(null, resp);
            })
            .catch(err => {
                callback(err, null);
            });
    }

    static isTaken(username, callback) {
        Http.Post(Paths.paths.takenPath, {username})
            .then(resp => {
                callback(null, resp);
            })
            .catch(err => {
                callback(err, null);
            });
    }

    static signout(callback) {
        Http.Delete(Paths.paths.signoutPath)
            .then(resp => {
                User.clearData();
                EventBus.publish('unauthorized', '');
                callback(null, resp);
            })
            .catch(err => {
                callback(err, null);
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
            Http.Put(Paths.paths.editPath, user)
                .then(resp => {
                    callback(null, resp);
                })
                .catch(err => {
                    callback(err, null);
                });
        }
    }

    static me(callback) {
        Http.Get(Paths.paths.mePath)
            .then(resp => {
                User.username = resp.username;
                User.avatar = resp.photo_uuid;
                callback(null, resp);
            })
            .catch(err => {
                return callback(err, null);
            });
    }
}

export default UserService;