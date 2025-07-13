module.exports.chatSockets = function (socketServer) {
  let io = require('socket.io')(socketServer, {
    cors: {
      origin:
        process.env.NODE_ENV === 'production'
          ? [
              process.env.RENDER_EXTERNAL_URL ||
                'https://your-app-name.onrender.com',
              'https://codeial-social.onrender.com',
            ]
          : [
              'http://localhost:8000',
              'http://localhost:3000',
              'http://127.0.0.1:8000',
            ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true, // Allow Engine.IO v3 clients for better compatibility
  });

  io.sockets.on('connection', function (socket) {
    console.log('New connection received:', socket.id);

    socket.on('disconnect', function (reason) {
      console.log('Socket disconnected:', socket.id, 'Reason:', reason);
    });

    socket.on('join_room', function (data) {
      try {
        console.log('Join room request received:', data);

        if (!data.chatroom || !data.user_email) {
          socket.emit('error', { message: 'Invalid room data' });
          return;
        }

        socket.join(data.chatroom);
        io.in(data.chatroom).emit('user_joined', data);

        console.log(`User ${data.user_name} joined room: ${data.chatroom}`);
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    socket.on('send_message', function (data) {
      try {
        if (!data.message || !data.chatroom || !data.user_email) {
          socket.emit('error', { message: 'Invalid message data' });
          return;
        }

        // Sanitize message (basic XSS prevention)
        data.message = data.message.replace(
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          ''
        );

        io.in(data.chatroom).emit('receive_message', data);
        console.log(
          'Message sent to room:',
          data.chatroom,
          'by:',
          data.user_name
        );
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle socket errors
    socket.on('error', function (error) {
      console.error('Socket error:', error);
    });
  });
};
