function createChat(server) {
  var io = require('socket.io').listen(server);
  var numGuests = 0;
  var nickname = {};
  var currentRooms = {};

  io.sockets.on('connection', function(socket) {
    socket.emit('message', { text: 'Welcome to the Chat App!' });
    numGuests += 1;
    nickname[socket.id] = "guest" + numGuests;

    socket.emit('message', {
      text: 'Your nickname is ' + nickname[socket.id],
      nickname: nickname[socket.id]
    });

    //Consider making into two separate methods so we don't have to
    //upload the whole hash every time
    io.sockets.emit('nicknamesUpdate', {
      nicknames: nickname
    })

    joinRoom(socket, "Lobby");

    socket.on('message', function(data) {
      data.text = nickname[socket.id] + ": " + data.text;
      io.sockets.in(currentRooms[socket.id]).emit('message', data);
    });

    socket.on('nicknameChangeRequest', function(data) {
      handleNicknameChange(socket, data);
    });

    socket.on('roomChangeRequest', function(data) {
      handleRoomChangeRequest(socket, data);
    });

    socket.on('disconnect', function() {
      io.sockets.in(currentRooms[socket.id]).emit(
        'message',
        { text: 'User ' + nickname[socket.id] + ' disconnected.' }
      );
      delete nickname[socket.id];
      delete currentRooms[socket.id];

      io.sockets.emit('nicknamesUpdate', {
        nicknames: nickname
      })

      emitRoomList(socket);
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
  }

  function handleRoomChangeRequest(socket, data) {
    socket.leave(currentRooms[socket.id]);
    joinRoom(socket, data.room);
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

  function joinRoom(socket, room) {
    currentRooms[socket.id] = room;
    socket.join(room);

    socket.emit("message", { text: "You have joined the room: " + room })
    emitRoomList(socket);
  }

  function emitRoomList(socket) {
    var inRoom = {roomUsers : []};

    Object.keys(currentRooms).forEach(function(id) {
      if (currentRooms[id] === currentRooms[socket.id]) {
        inRoom.roomUsers.push(nickname[id]);
      }
    })

    console.log(inRoom);

    io.sockets.in(currentRooms[socket.id]).emit("roomList", inRoom);
  }
};

exports.createChat = createChat;