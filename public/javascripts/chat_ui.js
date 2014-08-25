(function(){
  var ChatApp = window.ChatApp = window.ChatApp || {};

  var ChatUI = ChatApp.ChatUI = function(chat, $el) {
    this.chat = chat;
    this.$el = $el;

    var ui = this;
    this.chat.socket.on('message', ui.renderMessage.bind(ui));
    this.chat.socket.on('nicknameChangeResult', ui.renderMessage.bind(ui))
    this.$el.find("form.new-message").on("submit", ui.getMessage.bind(ui));
  }

  ChatUI.prototype.getMessage = function(event) {
    event.preventDefault();
    var data = $(event.currentTarget).serializeJSON();

    if (data.text.charAt(0) === "/") {
      this.chat.processCommand(data);
    } else {
      this.chat.sendMessage(data);
    }
  }

  ChatUI.prototype.renderMessage = function(data) {
    console.log(data)
    var $li = $("<li>");
    $li.text(data.text);
    this.$el.find("ul.chat").append($li);
  }


})();