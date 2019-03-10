'use strict';

import Http from '../modules/http';
import Paths from '../modules/pathConfig';

class AvatarService {
    static sendAvatar(photo, callback) {
        let data = new FormData();
        data.append('photo', photo);
        Http.Post(Paths.paths.avatar, data, true)
            .then(resp => {
                callback(null, resp);
            })
            .catch(err => {
                callback(err, null);
            });
    }

    static getAvatar(callback, photo_uuid) {
        Http.Get(`${Paths.paths.avatar}/${photo_uuid}`, true)
            .then(resp => {
                callback(null, resp);
            })
            .catch(err => {
                callback(err, null);
            });
    }
}

export default AvatarService;