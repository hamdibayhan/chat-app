var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var User = require('../user/User');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

router.post('/register', function(req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    }, 
    function (err, user) {
      if (err) return res.status(500).send("There was a problem registering the user.");
  
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400
      });
  
      res.status(200).send({ auth: true, token: token });
    });
  });

  router.post('/login', function(req, res) {

    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) return res.status(500).send('Error on the server.');
      if (!user) return res.status(404).send('No user found.');
      
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
  
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400
      });
  
      res.status(200).send({ auth: true, token: token });
    });
  
  });

  module.exports = router;