var { server } = require('./app');
var port = process.env.PORT || 4000;

server.listen(port, function() {
  console.log('Express server listening on port ' + port);
});