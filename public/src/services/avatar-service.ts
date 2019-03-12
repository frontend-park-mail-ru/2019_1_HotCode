'use strict';

import Http from '../modules/http';
import Paths from '../utils/pathConfig';

class AvatarService {

    static sendAvatar(photo: File): Promise<any> {

        let data = new FormData();
        data.append('photo', photo);
        return Http.Post(Paths.paths.avatar, data, true);
    }


    static getAvatar(photo_uuid: string): Promise<any> {

        return Http.Get(`${Paths.paths.avatar}/${photo_uuid}`, true);
    }
}

export default AvatarService;