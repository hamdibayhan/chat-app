var redis = require('redis');
var client = '';
const dotenv = require('dotenv');
dotenv.config();

function assignChatRoom(userId, res, token) {
    client = redis.createClient(`redis://${process.env.REDIS_URL}`);
    client.get(`chat_${userId}`, function(error, result) {
        if (error) throw error;
        chatRoom = result;

        if(result == null) {
            var randomNumber = Math.floor(Math.random() * 10);
            chatRoom = `chat_room_${randomNumber}`;
            client.set(`chat_${userId}`, chatRoom);
        }
        
        res.status(200).send({ auth: true, token: token, chat_room: chatRoom });
    });  
}

module.exports = assignChatRoom;