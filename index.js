'use strict';

const express = require('express');
const path = require('path');
// const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 8000;

// app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'dist')));
app.get('/*', (req,res) =>{
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port);