var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var User = require('../user/User');
var ChatHelpers = require('../chat/helpers');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

router.post('/register', function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if(name == undefined || email == undefined || password == undefined) {
    return res.status(500).send({ message: "Please fill all input" });
  }

  var hashedPassword = bcrypt.hashSync(password, 8);

  User.create({
    name: name,
    email: email,
    password: hashedPassword
  },
  function (err, user) {
    if (err) return res.status(500).send({ message: "There was a problem registering the user." });
    var userId = user._id;
    var token = jwt.sign({ id: userId }, config.secret_key, {
      expiresIn: 86400
    });

    ChatHelpers.assignChatRoom(userId, res, token);
  });
});

router.post('/login', function(req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send({ message: 'Error on the server.' });
    if (!user) return res.status(404).send({ message: 'No user found.' });
    
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    
    var userId = user._id;
    var token = jwt.sign({ id: userId }, config.secret_key, {
      expiresIn: 86400
    });

    ChatHelpers.assignChatRoom(userId, res, token);
  });
});

module.exports = router;