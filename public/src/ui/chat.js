// ============================================================
// ЧАТ (С СЕТЕВЫМ СИНХРОНОМ И ЗАЩИТОЙ ВВОДА)
// ============================================================

import { sendToServer } from '../network/socket.js';

export function initChat() {
  const chatToggle = document.getElementById('chat-toggle');
  const chatEl = document.getElementById('chat');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  let chatVisible = false;

  function toggleChat(show) {
    chatVisible = show !== undefined ? show : !chatVisible;
    chatEl.style.display = chatVisible ? 'flex' : 'none';

    if (chatVisible) {
      // При открытии чата отпускаем мышку, чтобы можно было печатать
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
      chatInput.focus();
    } else {
      chatInput.blur();
    }
  }

  chatToggle?.addEventListener('click', () => toggleChat());
  chatSend?.addEventListener('click', sendChat);

  chatInput?.addEventListener('keydown', (e) => {
    e.stopPropagation(); // Чтобы нажатия клавиш в чате не уходили в управление игроком

    if (e.key === 'Enter') {
      sendChat();
      toggleChat(false); // Закрываем чат после отправки
    }
    if (e.key === 'Escape') {
      toggleChat(false);
    }
  });

  function sendChat() {
    const text = chatInput.value.trim();
    if (!text) return;

    // 1. Показываем у себя
    addChatMessage('Я', text, '#00ff88');

    // 2. Отправляем на сервер для остальных игроков
    sendToServer({
      type: 'chat',
      text: text
    });

    chatInput.value = '';
  }

  window.toggleChat = toggleChat;
}

// Экспортируем функцию, чтобы sync.js мог вызывать её при входящих сообщениях
export function addChatMessage(name, text, color = '#00f3ff') {
  const chatLog = document.getElementById('chat-log');
  if (!chatLog) return;

  const div = document.createElement('div');
  div.className = 'msg';

  // Безопасная вставка текста (защита от XSS)
  const nameSpan = document.createElement('span');
  nameSpan.className = 'name';
  nameSpan.style.color = color;
  nameSpan.textContent = `${name}: `;

  const textSpan = document.createElement('span');
  textSpan.className = 'text';
  textSpan.textContent = text;

  div.appendChild(nameSpan);
  div.appendChild(textSpan);

  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}
