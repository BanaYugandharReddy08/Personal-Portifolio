document.addEventListener('DOMContentLoaded', function () {
  // Create chat bubble
  const bubble = document.createElement('div');
  bubble.id = 'chat-bubble';
  bubble.tabIndex = 0;
  bubble.setAttribute('aria-label', 'Open chat');
  bubble.textContent = '💬';
  document.body.appendChild(bubble);

  // Create chat panel
  const panel = document.createElement('div');
  panel.id = 'chat-panel';
  panel.innerHTML = `
    <div class="chat-header">
      <span>Chat with Yugi</span>
      <button class="chat-close" aria-label="Close chat">❌</button>
    </div>
    <div class="chat-body"></div>
    <div class="chat-input">
      <input type="text" id="chat-message-input" aria-label="Type your message" placeholder="Type your message..." />
      <button id="chat-send-btn" aria-label="Send message">Send</button>
    </div>
  `;
  document.body.appendChild(panel);

  const body = panel.querySelector('.chat-body');
  const input = panel.querySelector('#chat-message-input');
  const sendBtn = panel.querySelector('#chat-send-btn');

  function openChat() {
    panel.classList.add('open');
  }

  function closeChat() {
    panel.classList.remove('open');
  }

  bubble.addEventListener('click', openChat);
  bubble.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openChat();
    }
  });

  panel.querySelector('.chat-close').addEventListener('click', closeChat);

  function addMessage(text, isUser) {
    const msg = document.createElement('div');
    msg.className = 'chat-message ' + (isUser ? 'user' : 'bot');
    msg.innerHTML = `
      <span class="avatar">${isUser ? '🧑‍💼' : '🧑‍💻'}</span>
      <div class="text">${text}</div>
    `;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  function findAnswer(query) {
    const lower = query.toLowerCase();
    for (const qa of qaData) {
      if (lower.includes(qa.question.toLowerCase())) {
        return qa.answer;
      }
    }
    return "I’m not sure yet – please email me at your-email@example.com.";
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, true);
    input.value = '';
    const reply = findAnswer(text);
    setTimeout(() => addMessage(reply, false), 500);
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });
});
