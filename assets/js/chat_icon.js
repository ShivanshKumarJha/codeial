document.addEventListener('DOMContentLoaded', function () {
  const chatIcon = document.getElementById('chat-icon');
  const chatBox = document.getElementById('chatbox');
  const closeButton = document.getElementById('close-chat');
  const homePane = document.getElementById('main-container');

  chatIcon.addEventListener('click', function () {
    chatBox.style.display = 'block';
    chatIcon.style.display = 'none';
  });

  closeButton.addEventListener('click', function () {
    chatBox.style.display = 'none';
    chatIcon.style.display = 'block';
  });

  document.addEventListener('click', function (e) {
    const isClickInsideChatBox = chatBox.contains(e.target);
    const isClickOnChatIcon = chatIcon.contains(e.target);

    if (!isClickInsideChatBox && !isClickOnChatIcon) {
      chatBox.style.display = 'none';
      chatIcon.style.display = 'block';
    }
  });
});
