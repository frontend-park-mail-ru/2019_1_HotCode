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

app.post('/sessions', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if (!username) {
        res.status(400);
        return res.json({'username': 'Пустое поле'});
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
        } else {
            res.status(400);
            return res.json({'password': 'Неверный пароль'});
        }
    } else {
        res.status(400);
        return res.json({'username': 'Неверный логин'});
    }

});

app.get('/sessions', function (req, res) {
    const id = req.cookies['maine_kekse'];
    const username = ids[id];
    if (!username || !users[username]) {
        res.status(401);
        return res.json({'message': 'Ошибка доступа'});
    }

    res.json({username: users[username].username});
});

app.delete('/sessions', function (req, res) {
    const id = req.cookies['maine_kekse'];
    const username = ids[id];
    if (!username || !users[username]) {
        res.status(401);
        return res.json({'message': 'Ошибка доступа'});
    }

    res.cookie('maine_kekse', id, {
        domain: 'localhost',
        expires: new Date(Date.now() - 1000 * 60 *10)
    });

    res.json({});
});

app.post('/users', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if (!username) {
        res.status(400);
        return res.json({'username': 'Пустое поле'});
    }
    if (users[username]) {
        res.status(400);
        return res.json({'username': 'Занято'});
    }
    users[username] = {
        username,
        password,
    };

    res.json({});
});

app.put('/users', function (req, res) {
    const id = req.cookies['maine_kekse'];
    const username = ids[id];
    console.log(users[username]);
    if (!username || !users[username]) {
        res.status(401);
        return res.json({'message': 'Ошибка доступа'});
    }

    if (req.body.username) {
        const newUsername = req.body.username;

        if (users[newUsername]) {
            res.status(400);
            return res.json({'username': 'Занято'});
        }

        users[username].username = newUsername
    }

    if (req.body.oldPassword || req.body.newPassword) {
        const oldPassword = req.body.oldPassword ? req.body.oldPassword : '';
        const newPassword = req.body.newPassword ? req.body.newPassword : '';

        if (users[username].password !== oldPassword) {
            res.status(400);
            return res.json({'oldPassword': 'Password'});
        }

        users[username].password = newPassword
    }

    res.json({});
});

app.post('/users/used', function (req, res) {
    const username = req.body.username;
    if (users[username]) {
        return res.json({'used': true});
    }
    return res.json({'used': false});
});



app.listen(8081);
