'use strict';

import Paths from '../utils/pathConfig';

class Http {

    private static server: string = Paths.server.backend;
    private static avatatServer: string = Paths.server.avatarBackend;

    static Get(path: string, avatarBackend = false, body = {}): Promise<any> {
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
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const back = avatarBackend ? Http.avatatServer : Http.server;
            xhr.open(method, `${back}${path}`, true);
            xhr.withCredentials = true;

            if (!avatarBackend) {
                if (method === 'PUT' ||
                    method === 'POST') {
                    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf8');
                }
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) return;
                if (+xhr.status >= 400) {
                    let error = '';
                    if (xhr.getResponseHeader("Content-Type") === 'image/jpeg' ||
                        xhr.getResponseHeader("Content-Type") === 'image/png' ||
                        xhr.getResponseHeader("Content-Type") === 'image/gif') {
                        error = xhr.responseText;
                    } else {
                        error = xhr.responseText ? JSON.parse(xhr.responseText) : xhr.responseText;
                    }
                    return reject(error);
                }

                let response = '';
                if (xhr.getResponseHeader("Content-Type") === 'image/jpeg' ||
                    xhr.getResponseHeader("Content-Type") === 'image/png' ||
                    xhr.getResponseHeader("Content-Type") === 'image/gif') {
                    response = xhr.responseText;
                } else {
                    response = xhr.responseText ? JSON.parse(xhr.responseText) : xhr.responseText;
                }
                resolve(response);
            };

            if (avatarBackend && body) {
                xhr.send(body);
            } else if (body) {
                xhr.send(JSON.stringify(body));
            } else {
                xhr.send();
            }
        });
    }
}

export default Http;