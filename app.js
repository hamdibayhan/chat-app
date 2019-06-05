var express = require('express');
var app = express();
var db = require('./db');
global.__root   = __dirname + '/'; 

var AuthController = require(__root + 'auth/AuthController');
app.use('/api/auth', AuthController);

var ChatController = require(__root + 'chat/ChatController');
app.use('/api/chat', ChatController);

module.exports = app;