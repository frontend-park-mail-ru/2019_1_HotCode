'use strict';

import Http from '../modules/http.js';

class UserService {
    constructor() {
        this.user = null;
        this.users = [];
    }

    signup(username, password, repeatPassword, callback) {
        if (password !== repeatPassword) {
            alert('Passwörter stimmen nicht überein');
            return;
        }
        const user = {username, password};
        Http.Post('/signup', user, callback);
    }

    auth(username, password, callback) {
        const user = {username, password};
        Http.Post('/auth', user, callback);
    }

    isLoggedIn() {
        return !!this.user;
    }

    me(callback, forse = false) {
        if (this.isLoggedIn() && !forse) {
            return callback(null, this.user);
        }
        Http.Get('/ich', function (err, userdata) {
            if (err) {
                return callback(err, userdata);
            }

            this.user = userdata;
            callback(null, userdata);
        }.bind(this));
    }
}

export default UserService;