'use strict';

import Paths from './pathConfig';


const server = Paths.server.backend;
const avatatServer = Paths.server.avatarBackend;

class Http {

    static Get(path, avatarBackend = false, body = '') {
        return Http.request('GET', path, body, avatarBackend);
    }

    static Delete(path) {
        return Http.request('DELETE', path);
    }

    static Post(path, body, avatarBackend = false) {
        return Http.request('POST', path, body, avatarBackend);
    }

    static Put(path, body) {
        return Http.request('PUT', path, body);
    }

    static request(method, path, body = '', avatarBackend = false) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const back = avatarBackend ? avatatServer : server;
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