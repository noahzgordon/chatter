(function() {
  var ChatApp = window.ChatApp = window.ChatApp || {};

  var Chat = ChatApp.Chat = function (socket) {
    this.socket = socket;
  };

  Chat.prototype.sendMessage = function(data) {
    this.socket.emit("message", { text: data.text });
  };
})();