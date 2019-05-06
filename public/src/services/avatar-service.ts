'use strict';

import Http from '../modules/http';
import {avatarPaths} from './utils/paths';
import serverNames from '../modules/utils/serverNames';

class AvatarService {

    private static server: string = serverNames.photoBackend;

    public static sendAvatar(photo: File): Promise<any> {

        const data = new FormData();
        data.append('photo', photo);
        return Http.Post(
            AvatarService.server + avatarPaths.sendAvatarPath, data,
            true,
            );
    }


    public static getAvatar(photoUuid: string): Promise<any> {

        return Http.Get(
            `${AvatarService.server}${avatarPaths.getAvatarPath}/${photoUuid}`,
            true,
            );
    }
}

export default AvatarService;