(function() {
  var ChatApp = window.ChatApp = window.ChatApp || {};

  var Chat = ChatApp.Chat = function (socket) {
    this.socket = socket;
  };

  Chat.prototype.sendMessage = function(data) {
    this.socket.emit("message", { text: data.text });
  };

  Chat.prototype.processCommand = function(data) {
    var spaceIndex = data.text.indexOf(" ");
    if (data.text.substring(1, spaceIndex) === "nick") {
      this.socket.emit("nicknameChangeRequest", data)
    } else if (data.text.substring(1, spaceIndex) === "join") {
      this.socket.emit("roomChangeRequest", {
        room: data.text.substring(spaceIndex+1)
      });
    }
  }
})();