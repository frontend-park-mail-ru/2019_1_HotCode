'use strict';

import serverNames from './utils/serverNames';

class Http {

    private static server: string = serverNames.backend;
    private static avatatServer: string = serverNames.avatarBackend;

    public static Get(path: string, avatarBackend = false, body = ''): Promise<any> {
        return Http.request('GET', path, body, avatarBackend);
    }

    public static Delete(path: string): Promise<any> {
        return Http.request('DELETE', path);
    }

    public static Post(path: string, body: any, avatarBackend = false): Promise<any> {
        return Http.request('POST', path, body, avatarBackend);
    }

    public static Put(path: string, body: any): Promise<any> {
        return Http.request('PUT', path, body);
    }

    private static request(method: string, path: string, body?: any, avatarBackend?: boolean): Promise<any> {
        const back = avatarBackend ? Http.avatatServer : Http.server;

        const headers = new Headers();

        if (!avatarBackend) {

            if (method === 'PUT' ||
                method === 'POST') {

                headers.append('Content-Type', 'application/json');
            }
        }

        if (body && !avatarBackend) {
            body = JSON.stringify(body);
        }

        if (method !== 'PUT' &&
            method !== 'POST') {
            body = undefined;
        }

        const uri = back + path;

        const init = {
            method,
            headers,
            body,
            mode: 'cors',
            credentials: 'include',
        };

        const request = new Request(uri, init as RequestInit);

        if (avatarBackend && method === 'GET') {
            return fetch(request)
                .then((response) => {
                    return Promise.resolve(response.blob());
                });
        }

        return fetch(request)
            .then((responce) => {

                if (!responce.ok) {

                    return responce.text().then((error) => {

                        return Promise.reject(error ? JSON.parse(error) : error);
                    });
                }

                return responce.text();
            })
            .then((resp) => {

                return Promise.resolve(resp ? JSON.parse(resp) : resp);
            });
    }
}

export default Http;