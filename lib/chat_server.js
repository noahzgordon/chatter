function createChat(server) {
  var io = require('socket.io').listen(server);

  io.sockets.on('connection', function(socket) {
    socket.emit('message', { text: 'Welcome to the Chat App!' });
    socket.on('message', function(data) {
      console.log(data);
      io.sockets.emit('message', data);
    });
  });
};

exports.createChat = createChat;