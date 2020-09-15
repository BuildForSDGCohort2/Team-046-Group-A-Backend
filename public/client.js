$( document ).ready(function() {

  /*global io*/
  var socket = io();

  $("form").submit(function(e){
    e.preventDefault(); // prevents message reloading
    socket.emit("chat message", $("#m").val());
    $("#m").val(""); // clear the text input field
    return false;
  });
  socket.on('user', function(data){
    $('#num-users').text(data.currentUsers+' users online');
    var message = data.name;
    if(data.connected) {
      message += ' has joined the chat.';
    } else {
      message += ' has left the chat.';
    }
    $('#messages').append($('<li>').html('<b>'+ message +'</b>'));
  });

  socket.on('chat message', function(data){
    $('#messages').append($('<li>').text(data.name+': '+data.message));
  });

});
