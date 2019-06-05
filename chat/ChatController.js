var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var redis = require('redis');
var client = '';
const dotenv = require('dotenv');
dotenv.config();

var User = require('../user/User');
var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));

router.post('/send_message', VerifyToken, function (req, res) {
  client = redis.createClient(`redis://${process.env.REDIS_URL}`);
  var userId = req.userId;

  User.findById(userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    var chatRoom = req.body.chat_room;

    client.get(`chat_${userId}`, function(error, result) {
      if (error) throw error;

      if(result == chatRoom) {
        client.get(chatRoom, function(error, result) {
          if (error) throw error;
    
          var newMessage = { 
            sender_name: user.name,
            message: req.body.message 
          }
      
          var newChatRoomMessages = result == null ? [] : JSON.parse(result);
          newChatRoomMessages.push(newMessage);
    
          client.set(chatRoom, JSON.stringify(newChatRoomMessages));
          res.status(200).send(
            { 
              is_message_send: true
            });
        });
      } else {
        res.status(200).send(
          { 
            is_message_send: false
          });
      }
    });
  });
});

router.post('/get_messages', VerifyToken, function (req, res) {
  client = redis.createClient(`redis://${process.env.REDIS_URL}`);
  var userId = req.userId;
  
  User.findById(userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    var chatRoom = req.body.chat_room;

    client.get(`chat_${userId}`, function(error, result) {
      if (error) throw error;

      if(result == chatRoom) {
        client.get(chatRoom, function(error, result) {
          if (error) throw error;
          res.status(200).send(
            { 
              all_messages: JSON.parse(result)
            });
        });
      } else {
        res.status(200).send(
          { 
            all_meesages: "Sorry, you don't belong in this room."
          });
      }
    });
  });
});

module.exports = router;