// ============================================================
// WEB SOCKET (МУЛЬТИПЛЕЕР)
// ============================================================

export let socket;
export let myId = '';
export let isConnected = false;
export const remotePlayers = {};
export const remoteMeshes = {};

export function initSocket() {
  // ПРАВИЛЬНЫЙ АДРЕС ДЛЯ RENDER
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

  socket.onmessage = (event) => {
    console.log('📩 Получено сообщение:', event.data);
  };

  socket.onclose = () => {
    isConnected = false;
    console.log('🔴 Отключено от сервера');
  };

  socket.onerror = (error) => {
    console.error('❌ Ошибка WebSocket:', error);
  };
}
