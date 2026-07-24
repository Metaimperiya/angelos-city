// ============================================================
// ЧАТ (С СЕТЕВЫМ СИНХРОНОМ И ЗАЩИТОЙ ВВОДА)
// ============================================================

import { sendToServer, socket } from '../network/socket.js';

export function initChat() {
  const chatToggle = document.getElementById('chat-toggle');
  const chatEl = document.getElementById('chat');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  let chatVisible = false;

  function toggleChat(show) {
    if (!chatEl) return;

    chatVisible = show !== undefined ? show : !chatVisible;
    chatEl.style.display = chatVisible ? 'flex' : 'none';

    if (chatVisible) {
      // 1. При открытии чата отпускаем мышку из Pointer Lock
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
      // 2. Ставим фокус в инпут с микрозадержкой для стабильности
      setTimeout(() => chatInput?.focus(), 50);
    } else {
      chatInput?.blur();
    }
  }

  // Клики по UI кнопкам (если они есть в HTML)
  chatToggle?.addEventListener('click', () => toggleChat());
  chatSend?.addEventListener('click', sendChat);

  // Обработка клавиш ВНУТРИ поля ввода
  chatInput?.addEventListener('keydown', (e) => {
    e.stopPropagation(); // Чтобы нажатия клавиш (WASD, Пробел) не уходили игроку

    if (e.key === 'Enter') {
      e.preventDefault();
      sendChat();
      toggleChat(false); // Закрываем чат после отправки
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      toggleChat(false);
    }
  });

  // 🎯 ГЛОБАЛЬНЫЙ СЛУШАТЕЛЬ: Открытие чата на Enter или T (Е)
  window.addEventListener('keydown', (e) => {
    // Если чат закрыт и мы не печатаем в другом инпуте
    if (!chatVisible && document.activeElement !== chatInput) {
      if (e.key === 'Enter' || e.code === 'KeyT') {
        e.preventDefault();
        toggleChat(true);
      }
    } else if (chatVisible && e.key === 'Escape') {
      e.preventDefault();
      toggleChat(false);
    }
  });

  function sendChat() {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;

    // 1. Показываем у себя
    addChatMessage('Я', text, '#00ff88');

    // 2. Отправляем на сервер для остальных игроков
    try {
      if (typeof sendToServer === 'function') {
        sendToServer({ type: 'chat', text: text });
      } else if (socket && socket.connected) {
        socket.emit('chatMessage', { text: text });
      }
    } catch (err) {
      console.error('Ошибка отправки сообщения в чат:', err);
    }

    chatInput.value = '';
  }

  window.toggleChat = toggleChat;
  console.log('💬 Чат инициализирован (Открытие на Enter / T)');
}

// Экспортируем функцию для добавления сообщений (вызывается из sync.js)
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
