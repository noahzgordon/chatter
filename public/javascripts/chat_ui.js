(function(){
  var ChatApp = window.ChatApp = window.ChatApp || {};

  var ChatUI = ChatApp.ChatUI = function(chat, $el) {
    this.chat = chat;
    this.$el = $el;

    var ui = this;
    this.chat.socket.on('message', ui.renderMessage.bind(ui));
    this.$el.find("form.new-message").on("submit", ui.getMessage.bind(ui));
  }

  ChatUI.prototype.getMessage = function(event) {
    event.preventDefault();
    var data = $(event.currentTarget).serializeJSON();
    this.sendMessage(data)
  }

  ChatUI.prototype.sendMessage = function(data) {
    this.chat.sendMessage(data);
  }

  ChatUI.prototype.renderMessage = function(data) {
    var $li = $("<li>");
    $li.text(data.text);
    this.$el.find("ul.chat").append($li);
  }


})();