(function(){
  var ChatApp = window.ChatApp = window.ChatApp || {};

  var ChatUI = ChatApp.ChatUI = function(chat, $el) {
    this.chat = chat;
    this.$el = $el;
    this.nicknames = {};
    console.log(this.chat.socket)

    var ui = this;
    this.chat.socket.on('message', ui.renderMessage.bind(ui));
    this.chat.socket.on('nicknameChangeResult', ui.renderMessage.bind(ui))
    this.$el.find("form.new-message").on("submit", ui.getMessage.bind(ui));
    this.chat.socket.on('nicknamesUpdate', ui.renderNicknames.bind(ui));
  }

  ChatUI.prototype.getMessage = function(event) {
    event.preventDefault();
    var data = $(event.currentTarget).serializeJSON();

    if (data.text.charAt(0) === "/") {
      this.chat.processCommand(data);
    } else {
      this.chat.sendMessage(data);
    }

    $(event.currentTarget).find('#new-message-text').val("");
  }

  ChatUI.prototype.renderMessage = function(data) {
    var $li = $("<li>");
    $li.text(data.text);
    this.$el.find("ul.chat").append($li);
  }

  ChatUI.prototype.renderNicknames = function(data) {
    this.$el.find("ul.users").empty();
    var $li;
    var that = this;

    Object.keys(data.nicknames).forEach(function(key) {
      $li = $("<li>").text(data.nicknames[key]);
      that.$el.find("ul.users").append($li);
    });
  }


})();