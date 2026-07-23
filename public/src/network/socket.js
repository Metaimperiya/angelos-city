// ============================================================
// WEB SOCKET (МУЛЬТИПЛЕЕР) — ЖЁСТКИЙ АДРЕС
// ============================================================

export let socket;
export let myId = '';
export let isConnected = false;
export const remotePlayers = {};
export const remoteMeshes = {};

export function initSocket() {
  // ЖЁСТКИЙ АДРЕС — ВПИШИ СВОЙ ДОМЕН
  const wsUrl = 'wss://angelos-city-3.onrender.com';
  socket = new WebSocket(wsUrl);

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
