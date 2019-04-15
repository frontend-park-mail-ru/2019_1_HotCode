'use strict';

const fallback = require('express-history-api-fallback');
const express = require('express');
const path = require('path');
const proxy = require('express-http-proxy');
const morgan = require('morgan');

const app = express();
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

// app.use(express.static(path.join(__dirname, 'dist')));
// app.get('/*', (req,res) =>{
//     res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

app.listen(port);