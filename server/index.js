'use strict';
const body = require('body-parser');
const cookie = require('cookie-parser');
const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid/v4');

const app = express();

app.use(morgan('dev'));
app.use(express.static('./dist/'));
app.use(body.json());
app.use(cookie());

const users = {};
const ids = {};

app.post('/auth', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if (!username) {
        return res.status(400).end();
    }
    if (users[username]) {
        if (users[username].password === password) {
            const id = uuid();
            ids[id] = username;

            res.cookie('maine_kekse', id, {
                domain: 'localhost',
                expires: new Date(Date.now() + 1000 * 60 *10)
            });

            res.json({id});
        }
    }
    else {
        return res.status(400).end();
    }

});

app.post('/signup', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if (!username) {
        return res.status(400).end();
    }
    if (users[username]) {
        return res.status(400).end();
    }
    users[username] = {
        username,
        password,
    };

    res.json({});
});

app.get('/ich', function (req, res) {
    const id = req.cookies['maine_kekse'];
    const username = ids[id];
    if (!username || !users[username]) {
        return res.status(401).end();
    }

    res.json(users[username]);
});


app.listen(8089);
