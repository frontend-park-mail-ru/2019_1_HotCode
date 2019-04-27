'use strict';

const fallback = require('express-history-api-fallback');
const express = require('express');
const ws = require('express-ws');
const path = require('path');
const proxy = require('express-http-proxy');
const morgan = require('morgan');

const app = express();

ws(app);

app.ws('/chat/connect', (ws) => {
    console.log('WebSocket');

    ws.on('message', (message) => {
        const request = JSON.parse(message);

        ws.send(`Anonist:~$ ${request.payload.message}`)
    });

    ws.on('close', () => {
        console.log('Close');
    });
});

const port = process.env.PORT || 8000;
const rootDir = path.resolve(__dirname, '..', 'dist');

app.use(morgan('dev'));
app.use(express.static(rootDir));

app.use(fallback('index.html', {root: rootDir}));

app.use('*', proxy('https://warscript.now.sh/', {
    proxyReqPathResolver: function (req) {
        return req.originalUrl;
    }
}));

app.listen(port);