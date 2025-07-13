class ChatEngine {
  constructor(chatBoxId, userEmail, userName) {
    this.chatBox = $(`#${chatBoxId}`);
    this.userEmail = userEmail;
    this.userName = userName;
    const socketBaseUrl = this.getSocketUrl();
    console.log('Connecting to Socket.IO server at:', socketBaseUrl);

    this.socket = io(socketBaseUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    if (this.userEmail || this.userName) {
      this.connectionHandler();
    }
  }

  // Determine the correct socket URL based on environment
  getSocketUrl() {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port;

    // Check if we're in development (localhost)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // In development, connect to the same port as the main server
      return `${protocol}//${hostname}${port ? ':' + port : ':8000'}`;
    }

    return 'https://codeial-social.onrender.com';
  }

  connectionHandler() {
    let self = this;

    // Connection event handlers
    this.socket.on('connect', function () {
      console.log('Connection established using sockets...!');
      self.showConnectionStatus('Connected', 'success');

      self.socket.emit('join_room', {
        user_email: self.userEmail,
        user_name: self.userName,
        chatroom: 'codeial',
      });

      self.socket.on('user_joined', function (data) {
        console.log('A user joined!', data);
      });
    });

    // Handle connection errors
    this.socket.on('connect_error', function (error) {
      console.error('Connection error:', error);
      self.showConnectionStatus('Connection failed', 'error');
    });

    // Handle disconnection
    this.socket.on('disconnect', function (reason) {
      console.log('Disconnected:', reason);
      self.showConnectionStatus('Disconnected', 'warning');
    });

    // Handle reconnection
    this.socket.on('reconnect', function (attemptNumber) {
      console.log('Reconnected after', attemptNumber, 'attempts');
      self.showConnectionStatus('Reconnected', 'success');
    });

    this.socket.on('reconnect_error', function (error) {
      console.error('Reconnection failed:', error);
      self.showConnectionStatus('Reconnection failed', 'error');
    });

    // Handle server errors
    this.socket.on('error', function (error) {
      console.error('Socket error:', error);
      self.showConnectionStatus(
        'Socket error: ' + (error.message || 'Unknown error'),
        'error'
      );
    });

    $('#send-message').click(function () {
      let msg = $('#chat-message-input').val();

      if (msg != '' && self.socket.connected) {
        self.socket.emit('send_message', {
          message: msg,
          user_email: self.userEmail,
          user_name: self.userName,
          chatroom: 'codeial',
        });
        $('#chat-message-input').val('');
      } else if (!self.socket.connected) {
        self.showConnectionStatus('Not connected. Please wait...', 'warning');
      }
    });

    // Handle Enter key press for sending messages
    $('#chat-message-input').keypress(function (e) {
      if (e.which === 13) {
        // Enter key
        $('#send-message').click();
      }
    });

    self.socket.on('receive_message', function (data) {
      console.log('Message received:', data.message);

      let newMessage = $('<li>');

      let messageType = 'other-message';

      if (
        data.user_email == self.userEmail ||
        data.user_name == self.userName
      ) {
        messageType = 'self-message';
      }

      newMessage.append(
        $('<span>', {
          html: data.message,
        })
      );

      newMessage.append(
        $('<sub>', {
          html: data.user_name,
        })
      );

      newMessage.addClass(messageType);

      $('#chat-messages-list').append(newMessage);

      // Auto-scroll to bottom
      const chatContainer = $('#chat-messages-list').parent();
      chatContainer.scrollTop(chatContainer[0].scrollHeight);
    });
  }

  // Show connection status to user
  showConnectionStatus(message, type) {
    // Remove any existing status messages
    $('.chat-status').remove();

    const statusClass =
      type === 'success'
        ? 'text-success'
        : type === 'error'
        ? 'text-danger'
        : 'text-warning';

    const statusElement = $(
      `<div class="chat-status ${statusClass} small mb-2">${message}</div>`
    );

    // Add to chat box header or create one if it doesn't exist
    if ($('#chatbox .chat-header').length) {
      $('#chatbox .chat-header').append(statusElement);
    } else {
      $('#chatbox').prepend(
        $('<div class="chat-header"></div>').append(statusElement)
      );
    }

    // Auto-remove success messages after 3 seconds
    if (type === 'success') {
      setTimeout(() => {
        statusElement.fadeOut(500, function () {
          $(this).remove();
        });
      }, 3000);
    }
  }
}
