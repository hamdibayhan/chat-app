var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var redis = require('redis');
var client = redis.createClient(`redis://${process.env.REDIS_URL}`);

var User = require('../user/User');
var ChatHelpers = require('./helpers');
var VerifyToken = require(__root + 'auth/VerifyToken');

var { io } = require('../app');

router.use(bodyParser.urlencoded({ extended: true }));

router.post('/send_message', VerifyToken, function (req, res) {
  var userId = req.userId;
  var chatRoom = req.body.chat_room;
  var message = req.body.message;
  
  if (message == undefined) return res.status(200)

  User.findById(userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");

    if (!ChatHelpers.isIncludeCensorKeyword(message)) {
      client.get(`chat_${userId}`, function(error, result) {
        if (error) throw error;

        if(result == chatRoom) {
          client.get(chatRoom, function(error, result) {
            if (error) throw error;
      
            var newMessage = { 
              sender_name: user.name,
              message: message 
            }
        
            var newChatRoomMessages = result == null ? [] : JSON.parse(result);
            newChatRoomMessages.push(newMessage);
      
            client.set(chatRoom, JSON.stringify(newChatRoomMessages), function(err, reply) {
              if (reply === 'OK') {
                res.status(200).send({ is_message_send: true });
                io.sockets.emit(chatRoom, newChatRoomMessages);
              } else {
                res.status(500).send({ message: err });
              }
            });
          });
        } else {
          res.status(500).send({ 
            is_message_send: false, 
            message: "Sorry, you don't belong in this room."
          });
        }
      });
    } else {
      res.status(500).send({
        message: "Sorry, your message includes banned keyword."
      });
    }
  });
});

router.get('/get_messages', VerifyToken, function (req, res) {
  var userId = req.userId;

  User.findById(userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send({ message: "There was a problem finding the user." });
    if (!user) return res.status(404).send({ message: "No user found." });

    var chatRoom = req.query.chat_room;

    client.get(`chat_${userId}`, function(error, result) {
      if (error) throw error;

      if(result == chatRoom) {
        client.get(chatRoom, function(error, result) {
          if (error) throw error;
          res.status(200).send({ all_messages: JSON.parse(result) });
        });
      } else {
        res.status(500).send({
          meesage: "Sorry, you don't belong in this room."
        });
      }
    });
  });
});

module.exports = router;