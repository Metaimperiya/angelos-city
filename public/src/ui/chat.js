// ============================================================
// ЧАТ (ФИКС 3: БЕЗОПАСНЫЙ)
// ============================================================

export function initChat() {
  const chatToggle = document.getElementById('chat-toggle');
  const chatEl = document.getElementById('chat');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  let chatVisible = false;

  function toggleChat() {
    chatVisible = !chatVisible;
    chatEl.style.display = chatVisible ? 'flex' : 'none';
    if (chatVisible) chatInput.focus();
  }

  chatToggle.addEventListener('click', toggleChat);
  chatSend.addEventListener('click', sendChat);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendChat();
  });

  function sendChat() {
    const text = chatInput.value.trim();
    if (!text) return;
    addChatMessage('Я', text, '#00ff88');
    chatInput.value = '';
  }

  // ФИКС 3: textContent вместо innerHTML
  function addChatMessage(name, text, color = '#00f3ff') {
    const chatLog = document.getElementById('chat-log');
    const div = document.createElement('div');
    div.className = 'msg';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    nameSpan.style.color = color;
    nameSpan.textContent = `${name}: `;

    const textSpan = document.createElement('span');
    textSpan.className = 'text';
    textSpan.textContent = text;

    div.append(nameSpan, textSpan);
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  window.addChatMessage = addChatMessage;
  window.toggleChat = toggleChat;
}
