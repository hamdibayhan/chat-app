I used the JSON web token for auth processes, bcryptjs package for salting the password.
Token are compared in VerifyToken.js.
MongoDB for registering the user. User model has 3 column that are name, email, password. 
Redis for chat messages. Application has 10 chat room, user assign as random to any chat rooms. User cannot send messages which includes banned keyword. 
Application api has 4 end point.

#### For Starting the server

* Fill .env file like in the env.sample
* npm install
* npm run server

#### Your server will run at http://localhost:4000

#### For Starting the client

* npm install
* npm run client

#### Your client will run at http://localhost:3000

## API Documentation

#### For VerifyToken

If token is null:
* Status: 403
```javascript
{ 
    auth: false, 
    message: 'No token provided.'
}
```

If token is false:
* Status: 500
```javascript
{ 
    auth: false, 
    message: 'Failed to authenticate token.'
}
```

#### POST Method - http://localhost:3000/api/auth/register

Params:
* name: John Doe
* email: johndoe@test.com
* password: 123123

If result is success:
* Status: 200
```javascript
{ 
    auth: true, 
    token: token, 
    chat_room: chat_room_123
}
```

If inputs are nil:
* Status: 500
```javascript
{ 
    message: "Please fill all input"
}
```

If error occurs:
* Status: 500
```javascript
{ 
    message: "There was a problem registering the user."
}
```

#### POST Method - http://localhost:3000/api/auth/login

Params:
* email: johndoe@test.com
* password: 123123

If result is success:
* Status: 200
```javascript
{
    auth: true, 
    token: token, 
    chat_room: chat_room_123
}
```

If password is invalid:
* Status: 401
```javascript
{ 
    auth: false, 
    token: null
}
```

If error occurs:
* Status: 500
```javascript
{ 
    message: "Error on the server."
}
```

If no user:
* Status: 404
```javascript
{ 
    message: "No user found."
}
```

#### POST Method - http://localhost:3000/api/chat/send_message

Header:
* x-access-token: token

Params:
* message: message
* chat_room: chat_room_123

If result is success:
* Status: 200
```javascript
{
    is_message_send: true
}
```
If error occurs:
* Status: 500
```javascript
{
    message: "Error on the server."
}
```

If no user:
* Status: 404
```javascript
{
    message: "No user found."
}
```

If chat room is not true:
* Status: 500
```javascript
{
    message: "Sorry, you don't belong in this room."
}
```

If message includes banned keyword:
* Status: 500
```javascript
{
    message: "Sorry, your message includes banned keyword."
}
```


#### GET Method - http://localhost:3000/api/chat/get_messages

Header:
* x-access-token: token

Params:
* chat_room: chat_room_123

If result is success:
* Status: 200
```javascript
{
    {
        "all_messages": [
        {
            "sender_name": "John Doe",
            "message": "Message"
        }
    }
}
```
If error occurs:
* Status: 500
```javascript
{
    message: "Error on the server."
}
```

If no user:
* Status: 404
```javascript
{
    message: "No user found."
}
```

If chat room is not true:
* Status: 500
```javascript
{
    message: "Sorry, you don't belong in this room."
}
```