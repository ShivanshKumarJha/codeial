class ChatEngine{constructor(e,s,o){this.chatBox=$(`#${e}`),this.userEmail=s,this.userName=o;window.location.hostname.includes("localhost");this.socket=io("http://localhost:5000",{transports:["websocket"]}),(this.userEmail||this.userName)&&this.connectionHandler()}connectionHandler(){let e=this;this.socket.on("connect",(function(){console.log("connection esteblished using sockets...!"),e.socket.emit("join_room",{user_email:e.userEmail,user_name:e.userName,chatroom:"codeial"}),e.socket.on("user_joined",(function(e){console.log("a user joined!")}))})),$("#send-message").click((function(){let s=$("#chat-message-input").val();""!=s&&e.socket.emit("send_message",{message:s,user_email:e.userEmail,user_name:e.userName,chatroom:"codeial"}),$("#chat-message-input").val("")})),e.socket.on("receive_message",(function(s){console.log("message received",s.message);let o=$("<li>"),a="other-message";s.user_email!=e.userEmail&&s.user_name!=e.userName||(a="self-message"),o.append($("<span>",{html:s.message})),o.append($("<sub>",{html:s.user_name})),o.addClass(a),$("#chat-messages-list").append(o)}))}}