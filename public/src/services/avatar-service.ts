'use strict';

import Http from '../modules/http';
import {avatarPaths} from './utils/paths';

class AvatarService {

    static sendAvatar(photo: File): Promise<any> {

        let data = new FormData();
        data.append('photo', photo);
        return Http.Post(avatarPaths.sendAvatarPath, data, true);
    }


    static getAvatar(photo_uuid: string): Promise<any> {

        return Http.Get(`${avatarPaths.getAvatarPath}/${photo_uuid}`, true);
    }
}

export default AvatarService;