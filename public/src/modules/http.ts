'use strict';

import Paths from '../utils/pathConfig';

class Http {

    private static server: string = Paths.server.backend;
    private static avatatServer: string = Paths.server.avatarBackend;

    static Get(path: string, avatarBackend = false, body = ''): Promise<any> {
        return Http.request('GET', path, body, avatarBackend);
    }

    static Delete(path: string): Promise<any> {
        return Http.request('DELETE', path);
    }

    static Post(path: string, body: any, avatarBackend = false): Promise<any> {
        return Http.request('POST', path, body, avatarBackend);
    }

    static Put(path: string, body: any): Promise<any> {
        return Http.request('PUT', path, body);
    }

    static request(method: string, path: string, body?: any, avatarBackend?: boolean): Promise<any> {
        const back = avatarBackend ? Http.avatatServer : Http.server;

        let headers = new Headers();

        if (!avatarBackend) {
            if (method === 'PUT' ||
                method === 'POST') {

                headers.append('Content-Type', 'application/json');
            }
        }

        if (body && !avatarBackend) {
            // console.log('body', body);
            body = JSON.stringify(body);
        }

        if (method !== 'PUT' &&
            method !== 'POST') {
            body = undefined;
        }

        const uri = back + path;

        const init = {
            method: method,
            headers: headers,
            body: body,
            mode: 'cors',
            credentials: 'include',
        };

        const request = new Request(uri, <RequestInit>init);

        return fetch(request)
            .then(responce => {
                if (!responce.ok) {
                    return responce.text().then(error => {
                        return Promise.reject(error ? JSON.parse(error) : error);
                    });
                }
                return responce.text();
            })
            .then(resp => {
                return Promise.resolve(resp ? JSON.parse(resp) : resp);
            })
    }
}

export default Http;