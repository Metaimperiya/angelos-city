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

  // ✅ ПОКАЗЫВАЕМ КНОПКУ ЧАТА (была скрыта в CSS)
  if (chatToggle) {
    chatToggle.style.display = 'block';
    chatToggle.style.position = 'absolute';
    chatToggle.style.bottom = '10px';
    chatToggle.style.left = '10px';
    chatToggle.style.zIndex = '99';
    chatToggle.style.background = 'rgba(0,0,0,0.7)';
    chatToggle.style.border = '1px solid #00f3ff';
    chatToggle.style.color = '#00f3ff';
    chatToggle.style.padding = '6px 14px';
    chatToggle.style.borderRadius = '20px';
    chatToggle.style.cursor = 'pointer';
    chatToggle.style.fontFamily = 'monospace';
    chatToggle.style.fontSize = '12px';
  }

  function toggleChat(show) {
    chatVisible = show !== undefined ? show : !chatVisible;
    
    if (chatEl) {
      chatEl.style.display = chatVisible ? 'flex' : 'none';
    }

    if (chatVisible) {
      // При открытии чата отпускаем мышку, чтобы можно было печатать
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
      if (chatInput) {
        chatInput.focus();
      }
    } else {
      if (chatInput) {
        chatInput.blur();
      }
    }
  }

  // Навешиваем события
  if (chatToggle) {
    chatToggle.addEventListener('click', () => toggleChat());
  }

  if (chatSend) {
    chatSend.addEventListener('click', sendChat);
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      e.stopPropagation(); // Чтобы нажатия клавиш в чате не уходили в управление игроком

      if (e.key === 'Enter') {
        sendChat();
        toggleChat(false); // Закрываем чат после отправки
      }
      if (e.key === 'Escape') {
        toggleChat(false);
      }
    });
  }

  function sendChat() {
    if (!chatInput) return;
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

  // Делаем доступным глобально для отладки
  window.toggleChat = toggleChat;
  window.sendChat = sendChat;

  console.log('💬 Чат инициализирован и готов к работе!');
}

// Экспортируем функцию, чтобы sync.js мог вызывать её при входящих сообщениях
export function addChatMessage(name, text, color = '#00f3ff') {
  const chatLog = document.getElementById('chat-log');
  if (!chatLog) {
    console.warn('⚠️ chat-log не найден');
    return;
  }

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
