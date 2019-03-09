'use strict';

import Http from '../modules/http';
import Paths from '../modules/pathConfig';

class AvatarService {
    static sendAvatar(photo, callback) {
        let data = new FormData();
        data.append('photo', photo);
        Http.Post(Paths.paths.avatar, data, (err, data) => {
            if (err) {
                return callback(err, data);
            }
            callback(null, data);
        }, true);
    }

    static getAvatar(callback, photo_uuid) {
        Http.Get(`${Paths.paths.avatar}/${photo_uuid}`, (err, data) => {
            if (err) {
                return callback(err, data);
            }

            callback(null, data);
        }, true);
    }
}

export default AvatarService;