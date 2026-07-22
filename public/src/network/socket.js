// ============================================================
// WEB SOCKET (ТОЛЬКО ПОДКЛЮЧЕНИЕ)
// ============================================================

export let socket;
export let isConnected = false;
let reconnectTimer = null;

export function initSocket() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  socket = new WebSocket(`${protocol}//${host}`);

  socket.onopen = () => {
    isConnected = true;
    console.log('🟢 Подключено к серверу');
    document.getElementById('loading').textContent = '✅ Подключено!';
    setTimeout(() => {
      const el = document.getElementById('loading');
      if (el) el.style.display = 'none';
    }, 1000);
  };

  socket.onclose = () => {
    isConnected = false;
    console.log('🔴 Отключено от сервера');
    document.getElementById('loading').textContent = '❌ Потеря соединения';
    // Автопереподключение через 3 секунды
    if (reconnectTimer) clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(() => {
      console.log('🔄 Переподключение...');
      initSocket();
    }, 3000);
  };

  socket.onerror = (error) => {
    console.error('❌ Ошибка WebSocket:', error);
  };
}

export function sendToServer(data) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  } else {
    console.warn('⚠️ Сокет не открыт, данные не отправлены');
  }
}
