'use strict';

import serverNames from './utils/serverNames';

class Http {

    public static Get(uri: string, isImage = false, body = ''): Promise<any> {
        return Http.request('GET', uri, body, isImage);
    }

    public static Delete(uri: string): Promise<any> {
        return Http.request('DELETE', uri);
    }

    public static Post(uri: string, body: any, isImage = false): Promise<any> {
        return Http.request('POST', uri, body, isImage);
    }

    public static Put(uri: string, body: any): Promise<any> {
        return Http.request('PUT', uri, body);
    }

    private static request(method: string, uri: string, body?: any, isImage?: boolean): Promise<any> {

        const headers = new Headers();

        if (!isImage) {

            if (method === 'PUT' ||
                method === 'POST') {

                headers.append('Content-Type', 'application/json');
            }
        }

        if (body && !isImage) {
            body = JSON.stringify(body);
        }

        if (method !== 'PUT' &&
            method !== 'POST') {
            body = undefined;
        }

        const init = {
            method,
            headers,
            body,
            mode: 'cors',
            credentials: 'include',
        };

        const request = new Request(uri, init as RequestInit);

        if (isImage && method === 'GET') {
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