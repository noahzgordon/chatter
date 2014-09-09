##Chatter
=======

A simple chat application built in node.js.

###Features and Technologies
+ Uses socket.io, allowing users to receive real-time updates.
+ Users can join or create chat rooms. System messages are emitted only to users in the same room as the user who prompts the message.
+ Users can change their names or switch chat rooms using the '/nick' and '/join' commands. These requests are handled and interpreted by the server.
+ jQuery event handlers respond to messages by appending them to the screens of all appropriate users and updating user lists.
