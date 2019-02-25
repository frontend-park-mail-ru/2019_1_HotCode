'use strict';

class Http {

    static Get(path, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', path, true);
        xhr.withCredentials = true;

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            if (+xhr.status >= 400) {
                return callback(xhr, null);
            }

            const response = JSON.parse(xhr.responseText);
            callback(null, response);
        };

        xhr.send();
    }

    static Post(path, body, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', path, true);
        xhr.withCredentials = true;

        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf8');

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            if (+xhr.status >= 400) {
                return callback(xhr, null);
            }

            const response = JSON.parse(xhr.responseText);
            callback(null, response);
        };

        xhr.send(JSON.stringify(body));
    }
}

export default Http;