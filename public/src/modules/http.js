'use strict';

import Paths from './pathConfig';

// const server = Paths.server.backend;
// const avatatServer = Paths.server.avatarBackend;
const server = '';

class Http {

    static Get(path, callback, avatarBackend = false, body = '') {
        Http.request('GET', path, callback, body, avatarBackend);
    }

    static Delete(path, callback) {
        Http.request('DELETE', path, callback);
    }

    static Post(path, body, callback, avatarBackend = false) {
        Http.request('POST', path, callback, body, avatarBackend);
    }

    static Put(path, body, callback) {
        Http.request('PUT', path, callback, body);
    }

    static request(method, path, callback, body = '', avatarBackend = false) {
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
                return callback(error, null);
            }

            let response = '';
            if (xhr.getResponseHeader("Content-Type") === 'image/jpeg' ||
                xhr.getResponseHeader("Content-Type") === 'image/png' ||
                xhr.getResponseHeader("Content-Type") === 'image/gif') {
                response = xhr.responseText;
            } else {
                response = xhr.responseText ? JSON.parse(xhr.responseText) : xhr.responseText;
            }
            callback(null, response);
        };

        if (avatarBackend && body) {
            console.log('avatar');
            xhr.send(body);
        } else if (body) {
            xhr.send(JSON.stringify(body));
        } else {
            xhr.send();
        }
    }
}

export default Http;