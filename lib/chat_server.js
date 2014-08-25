function createChat(server) {
  var io = require('socket.io').listen(server);
  var numGuests = 0;
  var nickname = {};



  io.sockets.on('connection', function(socket) {
    socket.emit('message', { text: 'Welcome to the Chat App!' });
    numGuests += 1;
    nickname[socket.id] = "guest" + numGuests;

    socket.emit('message', {
      text: 'Your nickname is ' + nickname[socket.id],
      nickname: nickname[socket.id]
    });

    //Consider making into two separate method so we don't have to
    //upload the whole hash every time
    io.sockets.emit('nicknamesUpdate', {
      nicknames: nickname
    })

    socket.on('message', function(data) {
      data.text = nickname[socket.id] + ": " + data.text;
      io.sockets.emit('message', data);
    });

    socket.on('nicknameChangeRequest', function(data) {
      handleNicknameChange(socket, data);
    });

    socket.on('disconnect', function() {
      io.sockets.emit(
        'message',
        { text: 'User ' + nickname[socket.id] + ' disconnected.' }
      );

      delete nickname[socket.id];
    })


  });

  function handleNicknameChange(socket, data) {
    var spaceIndex = data.text.indexOf(" ");
    var nicknm = data.text.substring(spaceIndex+1);
    if(data.text.substring(1, spaceIndex) === "nick") {
      if (data.text.substring(spaceIndex).indexOf("guest") > -1 ){
        socket.emit('nicknameChangeResult', {
          success: false,
          text: 'Names cannot contain the phrase "guest."'
        });
      } else if (isTaken(nicknm)){
        socket.emit('nicknameChangeResult', {
          success: false,
          text: 'Name taken.'
        });
      } else {
        nickname[socket.id] = nicknm;
        socket.emit('nicknameChangeResult', {
          success: true,
          text: 'Name changed to: ' + nicknm,
          nickname: nicknm
        });

        io.sockets.emit('nicknamesUpdate', {
          nicknames: nickname
        })
      }

    }

    // console.log(nickname[socket]);
  }

  function isTaken(nicknm) {
    var taken = false;
    Object.keys(nickname).forEach(function(key) {
      if (nickname[key] === nicknm) {
        taken = true;
      }
    })

    return taken;
  }
};

exports.createChat = createChat;