'use strict';

const fallback = require('express-history-api-fallback');
const express = require('express');
const path = require('path');
const proxy = require('express-http-proxy');
const morgan = require('morgan');

const app = express();

const rootDir = path.resolve(__dirname, '..', 'dist');

console.log(rootDir);

app.use(morgan('dev'));
app.use(express.static(rootDir));

app.use(fallback('./index.html', {root: rootDir}));

app.use('*', proxy('http://war-script.herokuapp.com/', {
    proxyReqPathResolver: function (req) {
        return req.originalUrl;
    }
}));

const port = process.env.PORT || 8000;

app.listen(port);