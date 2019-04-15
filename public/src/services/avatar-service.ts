'use strict';

import Http from '../modules/http';
import {avatarPaths} from './utils/paths';

class AvatarService {

    public static sendAvatar(photo: File): Promise<any> {

        const data = new FormData();
        data.append('photo', photo);
        return Http.Post(avatarPaths.sendAvatarPath, data, true);
    }


    public static getAvatar(photoUuid: string): Promise<any> {

        return Http.Get(`${avatarPaths.getAvatarPath}/${photoUuid}`, true);
    }
}

export default AvatarService;