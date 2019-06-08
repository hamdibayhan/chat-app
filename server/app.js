var express = require('express');
var cors = require('cors');
var app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const dotenv = require('dotenv');
dotenv.config();
var db = require('./db');
global.__root   = __dirname + '/'; 

app.use(cors());

module.exports = { 
    server: server,
    io: io
}

var AuthController = require(__root + 'auth/AuthController');
app.use('/api/auth', AuthController);

var ChatController = require(__root + 'chat/ChatController');
app.use('/api/chat', ChatController);
